import { Modal } from "../ui/modal";
import { NumberBall, StarBall } from "./Balls";
import type { EngineAssociationDetail, EngineCombination, EngineResponse } from "../../services/engineService";

const ASSOCIATION_LABELS: Record<EngineAssociationDetail["kind"], string> = {
  number_pair: "Paire de numéros",
  star_pair: "Paire d'étoiles",
  number_star: "Numéro + étoile",
};

const percent = (value: number) => `${(value * 100).toFixed(2)} %`;
const signed = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-gray-100 py-1.5 last:border-0 dark:border-gray-800">
      <span className="text-theme-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">{value}</span>
    </div>
  );
}

function CombinationDetails({
  combination,
  highlighted,
}: {
  combination: EngineCombination;
  highlighted: boolean;
}) {
  const lift = Math.exp(combination.factors.associations);
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlighted
          ? "border-brand-400 bg-brand-50/70 dark:border-brand-500 dark:bg-brand-500/10"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-400 text-sm font-extrabold text-brand-950">
          {combination.rank}
        </span>
        {combination.numbers.map((number, index) => (
          <NumberBall key={number} number={number} delay={index * 40} compact />
        ))}
        <span className="mx-1 h-8 w-px bg-gray-200 dark:bg-gray-700" />
        {combination.stars.map((star, index) => (
          <StarBall key={star} number={star} delay={(index + 5) * 40} compact />
        ))}
        <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-theme-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          percentile {combination.relative_score.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-1 text-theme-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Décomposition du score
          </h4>
          <ScoreRow label="Score global (z)" value={combination.score.toFixed(3)} />
          <ScoreRow
            label="Individuel — probabilité géométrique moyenne"
            value={`${percent(Math.exp(combination.factors.individual))} (z ${combination.dimensions.individual.toFixed(2)})`}
          />
          <ScoreRow
            label="Profil — probabilité géométrique moyenne"
            value={`${percent(Math.exp(combination.factors.profile))} (z ${combination.dimensions.profile.toFixed(2)})`}
          />
          <ScoreRow
            label="Associations — facteur géométrique moyen"
            value={`×${lift.toFixed(2)} (z ${combination.dimensions.associations.toFixed(2)})`}
          />
          <ScoreRow
            label="Fiabilité des associations"
            value={percent(combination.association_reliability)}
          />
          <ScoreRow
            label="Similarité max. aux autres grilles"
            value={percent(combination.similarity)}
          />
        </div>

        <div>
          <h4 className="mb-1 text-theme-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Boules — probabilité estimée
          </h4>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div>
              {combination.individuals.numbers.map((item) => (
                <ScoreRow
                  key={item.number}
                  label={`N° ${item.number} · fréq. ${item.frequency ?? "n/d"} % · retard ${item.delay ?? "n/d"}`}
                  value={percent(item.probability)}
                />
              ))}
            </div>
            <div>
              {combination.individuals.stars.map((item) => (
                <ScoreRow
                  key={item.star}
                  label={`Étoile ${item.star} · fréq. ${item.frequency ?? "n/d"} % · retard ${item.delay ?? "n/d"}`}
                  value={percent(item.probability)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 text-theme-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Profil de la grille ({combination.profile.length} familles)
          </h4>
          <div className="space-y-1">
            {combination.profile.map((detail) => (
              <div
                key={detail.family}
                className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-theme-xs dark:bg-gray-800/60"
              >
                <p className="font-semibold text-gray-700 dark:text-gray-200">{detail.label}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {detail.key} — observé {detail.count}/{detail.total} fois · log P{" "}
                  {detail.log_probability.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-theme-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Associations ({combination.associations.length})
          </h4>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {combination.associations.map((detail) => (
              <div
                key={`${detail.kind}-${detail.pair.join("-")}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-2.5 py-1.5 text-theme-xs dark:bg-gray-800/60"
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {ASSOCIATION_LABELS[detail.kind]} {detail.pair.join(" + ")} · {detail.count} fois
                </span>
                <span
                  className={`font-semibold ${
                    detail.contribution >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-error-500"
                  }`}
                >
                  {signed(detail.contribution)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EngineDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EngineResponse | null;
  focused: number;
}

export default function EngineDetailsModal({
  isOpen,
  onClose,
  result,
  focused,
}: EngineDetailsModalProps) {
  if (!result) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-h-[90vh] max-w-5xl overflow-y-auto p-5 sm:p-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-title-sm font-bold text-gray-800 dark:text-white/90">
            Analyse du moteur statistique
          </h2>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Tirage du {result.date} · graine {result.seed} ·{" "}
            {result.candidates.toLocaleString("fr-FR")} candidates ·{" "}
            {result.history.draws_used} tirages utilisés ({result.history.first_date} →{" "}
            {result.history.last_date}) · {result.elapsed_ms.toFixed(0)} ms
          </p>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Snapshot numéros : {result.sources.numbers_date} · snapshot étoiles :{" "}
            {result.sources.stars_date} · confiance : {result.meta.confidence} · version{" "}
            {result.meta.engine_version}
          </p>
        </div>

        {result.warnings.length > 0 && (
          <div className="rounded-xl border border-warning-300/60 bg-warning-50 px-3 py-2 text-theme-xs text-warning-800 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-300">
            <p className="font-semibold">Avertissements</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {result.combinations.map((combination, index) => (
            <CombinationDetails
              key={`${combination.rank}-${combination.numbers.join("-")}`}
              combination={combination}
              highlighted={index === focused}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-theme-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <h3 className="mb-2 text-theme-sm font-bold text-gray-800 dark:text-white/90">
              Modèle et pondérations
            </h3>
            <p>{result.meta.probability_model}</p>
            <p className="mt-1">{result.meta.frequency_calibration}</p>
            <p className="mt-1">
              Fenêtres : {result.meta.windows.recent} / {result.meta.windows.previous} tirages ·
              lissage des profils : {result.meta.profile_smoothing}
            </p>
            <p className="mt-1">
              Score : {result.meta.score} · score relatif : {result.meta.relative_score}
            </p>
            <p className="mt-1">
              Diversité : seuil {result.selected_diversity.threshold ?? "relâché"} · similarité
              moyenne {percent(result.selected_diversity.mean_similarity)}
            </p>
            <p className="mt-1">
              Poids des dimensions :{" "}
              {Object.entries(result.meta.dimension_weights)
                .map(([name, weight]) => `${name} ${(weight * 100).toFixed(0)} %`)
                .join(" · ")}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-theme-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <h3 className="mb-2 text-theme-sm font-bold text-gray-800 dark:text-white/90">
              Limites
            </h3>
            <ul className="list-disc space-y-1 pl-4">
              {result.meta.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
