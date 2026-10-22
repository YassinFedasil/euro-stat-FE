import { useRef, useState } from "react";
import { Dice5, Save, Sparkles } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import { NumberBall, StarBall } from "../components/euromillions/Balls";
import { ApiError } from "../services/api";
import { fetchNumbers, fetchStars, saveCombinations } from "../services/euromillionsService";

const DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;
const COMBINATIONS_COUNT = 5;

type GeneratedCombination = {
  numbers: number[];
  stars: number[];
};

type SaveFeedback = {
  kind: "success" | "error";
  message: string;
};

function todayDate(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

function sampleDistinct(pool: number[], count: number): number[] {
  const copy = [...pool];
  const out: number[] = [];
  while (out.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out.sort((a, b) => a - b);
}

function isValidCombination(numbers: number[], stars: number[]): boolean {
  const numbersOk =
    numbers.length === 5 &&
    new Set(numbers).size === 5 &&
    numbers.every((n) => n >= 1 && n <= 50);
  const starsOk =
    stars.length === 2 &&
    new Set(stars).size === 2 &&
    stars.every((s) => s >= 1 && s <= 12);
  return numbersOk && starsOk;
}

function buildCombinations(pools: { numbers: number[]; stars: number[] }): GeneratedCombination[] {
  const combinations: GeneratedCombination[] = [];
  const seen = new Set<string>();

  for (let attempt = 0; attempt < 500 && combinations.length < COMBINATIONS_COUNT; attempt += 1) {
    const numbers = sampleDistinct(pools.numbers, 5);
    const stars = sampleDistinct(pools.stars, 2);
    if (!isValidCombination(numbers, stars)) continue;

    const key = `${numbers.join("-")}|${stars.join("-")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    combinations.push({ numbers, stars });
  }

  return combinations;
}

function describeFetchError(error: unknown, value: string): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return `Aucun tirage disponible pour le ${value}. Vérifiez la date : les tirages EuroMillions ont lieu le mardi et le vendredi.`;
    }
    if (error.status === 0 || error.status >= 500) {
      return "⚠️ Le serveur est momentanément indisponible. Réessayez dans quelques instants.";
    }
  }
  return `⚠️ Impossible de récupérer les données pour le ${value}.`;
}

function describeSaveError(error: unknown): string {
  if (error instanceof ApiError && (error.status === 0 || error.status >= 500)) {
    return "⚠️ Le serveur est momentanément indisponible : les combinaisons n'ont pas été enregistrées. Réessayez dans quelques instants.";
  }
  return "⚠️ L'enregistrement a échoué. Les combinaisons n'ont pas été sauvegardées.";
}

export default function EuroMillions() {
  const [date, setDate] = useState<string>(todayDate);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [combinations, setCombinations] = useState<GeneratedCombination[]>([]);
  const [revealKey, setRevealKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);
  const poolsRef = useRef<{ numbers: number[]; stars: number[] } | null>(null);

  const generate = (pools: { numbers: number[]; stars: number[] }) => {
    const next = buildCombinations(pools);
    if (next.length < COMBINATIONS_COUNT) return false;
    setCombinations(next);
    setRevealKey((key) => key + 1);
    return true;
  };

  const handleStart = async () => {
    const value = date.trim();
    if (!DATE_REGEX.test(value)) {
      setError("Format de date invalide. Utilisez JJ-MM-AAAA (ex: 29-09-2026).");
      setCombinations([]);
      return;
    }

    setError(null);
    setSaveFeedback(null);
    setGenerating(true);
    setCombinations([]);

    try {
      const [numbersDoc, starsDoc] = await Promise.all([
        fetchNumbers(value),
        fetchStars(value),
      ]);

      const numbersPool = numbersDoc.numbers
        .map((row) => Number(row.number))
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= 50);
      const starsPool = starsDoc.stars
        .map((row) => Number(row.star))
        .filter((s) => Number.isInteger(s) && s >= 1 && s <= 12);

      if (numbersPool.length < 5 || starsPool.length < 2) {
        setError(`⚠️ Les données du tirage du ${value} ne sont pas encore disponibles.`);
        return;
      }

      poolsRef.current = { numbers: numbersPool, stars: starsPool };
      generate(poolsRef.current);
    } catch (err) {
      setError(describeFetchError(err, value));
    } finally {
      setGenerating(false);
    }
  };

  const handleReroll = () => {
    setError(null);
    setSaveFeedback(null);
    if (!poolsRef.current) {
      void handleStart();
      return;
    }
    generate(poolsRef.current);
  };

  const handleSave = async () => {
    if (combinations.length !== COMBINATIONS_COUNT) return;
    setSaving(true);
    setSaveFeedback(null);
    try {
      const response = await saveCombinations(date, combinations);
      setSaveFeedback({ kind: "success", message: `✅ ${response.message}` });
    } catch (err) {
      setSaveFeedback({ kind: "error", message: describeSaveError(err) });
    } finally {
      setSaving(false);
    }
  };

  const hasCombinations = combinations.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageMeta
        title="EuroMillions — Générateur de combinaisons"
        description="Générez cinq grilles EuroMillions aléatoires pour la date de votre choix et enregistrez-les."
      />

      <div className="relative overflow-hidden rounded-3xl border border-brand-800/60 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-5 py-10 shadow-theme-lg sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-warning-400/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <h1 className="mt-4 text-title-sm font-bold uppercase tracking-wide text-white sm:text-title-md">
            EuroMillions
          </h1>
          <p className="mt-2 max-w-md text-theme-sm text-blue-100/80">
            Générez 5 combinaisons aléatoires pour le tirage de votre choix, puis enregistrez-les.
          </p>
        </div>

        <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <label htmlFor="em-date" className="flex flex-col items-center gap-1.5 sm:items-end">
            <input
              id="em-date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCombinations([]);
                setSaveFeedback(null);
                setError(null);
                poolsRef.current = null;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleStart();
              }}
              placeholder={todayDate()}
              disabled={generating || saving}
              className="h-13 w-44 rounded-xl border border-white/20 bg-white/10 px-4 text-center text-lg font-semibold tracking-widest text-white placeholder:text-white/40 focus:border-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-300/40 disabled:opacity-60 sm:h-14 sm:w-48 sm:text-xl"
            />
          </label>

          <button
            onClick={() => void handleStart()}
            disabled={generating || saving}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-warning-300 to-warning-500 px-6 text-base font-bold uppercase tracking-wider text-brand-950 shadow-theme-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14"
          >
            <Sparkles className="h-5 w-5" />
            Démarrer
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="relative mt-6 rounded-xl bg-error-500/90 px-4 py-3 text-center text-theme-sm font-medium text-white shadow-theme-md"
          >
            {error}
          </div>
        )}

        {generating && (
          <div className="relative mt-10 flex flex-col items-center gap-3" aria-live="polite">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-3 w-3 animate-bounce rounded-full bg-warning-400"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-theme-sm font-semibold uppercase tracking-widest text-blue-100/80">
              ✨ Génération…
            </p>
          </div>
        )}

        {hasCombinations && !generating && (
          <div className="relative mt-8 flex flex-col gap-3" aria-live="polite">
            <p className="text-center text-theme-sm font-semibold uppercase tracking-widest text-blue-100/70">
              Vos 5 combinaisons — Tirage du {date}
            </p>

            {combinations.map((combination, index) => (
              <div
                key={`${revealKey}-${index}`}
                className="flex flex-col gap-3 rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10 sm:flex-row sm:items-center"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-400 text-sm font-extrabold text-brand-950">
                  {index + 1}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {combination.numbers.map((number, position) => (
                    <NumberBall
                      key={number}
                      number={number}
                      delay={position * 60}
                      compact
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  {combination.stars.map((star, position) => (
                    <StarBall
                      key={star}
                      number={star}
                      delay={(combination.numbers.length + position) * 60}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 px-6 py-3 text-theme-sm font-bold uppercase tracking-wider text-emerald-950 shadow-theme-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {saving ? "Enregistrement…" : "Enregistrer les 5 combinaisons"}
              </button>

              <button
                onClick={handleReroll}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Dice5 className="h-5 w-5 text-warning-400" />
                Nouvelle combinaison
              </button>
            </div>

            {saveFeedback && (
              <div
                role="status"
                className={`mt-1 rounded-xl px-4 py-3 text-center text-theme-sm font-medium text-white shadow-theme-md ${
                  saveFeedback.kind === "success" ? "bg-emerald-600/90" : "bg-error-500/90"
                }`}
              >
                {saveFeedback.message}
              </div>
            )}

            <p className="text-center text-theme-xs text-blue-100/60">
              Propositions statistiques · 5 numéros (1–50) · 2 étoiles (1–12) · un nouvel enregistrement remplace le précédent
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
