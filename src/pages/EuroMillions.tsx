import { useEffect, useRef, useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, Dice5, Save, Sparkles } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import EngineDetailsModal from "../components/euromillions/EngineDetailsModal";
import { NumberBall, StarBall } from "../components/euromillions/Balls";
import { ApiError } from "../services/api";
import { fetchNumbers, fetchStars, saveCombinations } from "../services/euromillionsService";
import { fetchEngineCombinations } from "../services/engineService";
import type { EngineResponse } from "../services/engineService";
import { getHistoryDraw } from "../services/historyService";
import type { OfficialResult } from "../services/historyService";

const DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;
const COMBINATIONS_COUNT = 5;
const CANDIDATES = 10_000;

type GeneratedCombination = {
  numbers: number[];
  stars: number[];
};

type DisplayCombination = GeneratedCombination & {
  rank?: number;
  relativeScore?: number;
};

type SaveFeedback = {
  kind: "success" | "error";
  message: string;
};

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function todayDate(): string {
  const now = new Date();
  return `${pad2(now.getDate())}-${pad2(now.getMonth() + 1)}-${now.getFullYear()}`;
}

function parseDateDDMMYYYY(value: string): Date | null {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateDDMMYYYY(date: Date): string {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function isEuromillionsDrawDay(date: Date): boolean {
  const day = date.getDay();
  return day === 2 || day === 5;
}

function getNextEuromillionsDrawDate(from: Date): Date {
  const current = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  current.setHours(0, 0, 0, 0);
  for (let offset = 1; offset <= 10; offset += 1) {
    const candidate = new Date(current);
    candidate.setDate(current.getDate() + offset);
    if (isEuromillionsDrawDay(candidate)) {
      return candidate;
    }
  }
  const fallback = new Date(current);
  fallback.setDate(current.getDate() + 3);
  return fallback;
}

function getPrevEuromillionsDrawDate(from: Date): Date {
  const current = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  current.setHours(0, 0, 0, 0);
  for (let offset = 1; offset <= 10; offset += 1) {
    const candidate = new Date(current);
    candidate.setDate(current.getDate() - offset);
    if (isEuromillionsDrawDay(candidate)) {
      return candidate;
    }
  }
  const fallback = new Date(current);
  fallback.setDate(current.getDate() - 3);
  return fallback;
}

function getDefaultEuromillionsDateString(): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.setHours(0, 0, 0, 0);
  if (isEuromillionsDrawDay(today)) {
    return formatDateDDMMYYYY(today);
  }
  const next = getNextEuromillionsDrawDate(today);
  return formatDateDDMMYYYY(next);
}

function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 32);
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
      return "Le serveur est momentanément indisponible. Réessayez dans quelques instants.";
    }
  }
  return `Impossible de récupérer les données pour le ${value}.`;
}

function describeEngineError(error: unknown, value: string): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return `Données statistiques indisponibles pour le ${value}. Vérifiez la date du tirage.`;
    }
    if (error.status === 409 || error.status === 400) {
      return error.message;
    }
    if (error.status === 0 || error.status >= 500) {
      return "Le moteur statistique est momentanément indisponible. Réessayez dans quelques instants.";
    }
  }
  return `Impossible d'analyser les données du ${value}.`;
}

function isTechnicalFailure(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 0 || error.status >= 500);
}

function describeSaveError(error: unknown): string {
  if (error instanceof ApiError && (error.status === 0 || error.status >= 500)) {
    return "Le serveur est momentanément indisponible : les combinaisons n'ont pas été enregistrées. Réessayez dans quelques instants.";
  }
  return "L'enregistrement a échoué. Les combinaisons n'ont pas été sauvegardées.";
}

export default function EuroMillions() {
  const [date, setDate] = useState<string>(getDefaultEuromillionsDateString);
  const [sampling, setSampling] = useState<"guided" | "uniform" | "ml">("uniform");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [engineResult, setEngineResult] = useState<EngineResponse | null>(null);
  const [fallbackCombinations, setFallbackCombinations] = useState<GeneratedCombination[]>([]);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [revealKey, setRevealKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsFocus, setDetailsFocus] = useState(0);
  const [officialResult, setOfficialResult] = useState<OfficialResult | null>(null);
  const poolsRef = useRef<{ numbers: number[]; stars: number[] } | null>(null);

  const goToPreviousDraw = () => {
    const parsed = parseDateDDMMYYYY(date);
    if (!parsed) {
      const prev = getPrevEuromillionsDrawDate(new Date());
      setDate(formatDateDDMMYYYY(prev));
    } else {
      const prev = getPrevEuromillionsDrawDate(new Date(parsed.getTime() - 24 * 60 * 60 * 1000));
      setDate(formatDateDDMMYYYY(prev));
    }
    resetDisplay();
    setError(null);
    poolsRef.current = null;
  };

  const goToNextDraw = () => {
    const parsed = parseDateDDMMYYYY(date);
    if (!parsed) {
      const next = getNextEuromillionsDrawDate(new Date());
      setDate(formatDateDDMMYYYY(next));
    } else {
      const next = getNextEuromillionsDrawDate(new Date(parsed.getTime() + 24 * 60 * 60 * 1000));
      setDate(formatDateDDMMYYYY(next));
    }
    resetDisplay();
    setError(null);
    poolsRef.current = null;
  };

  const resetDisplay = () => {
    setEngineResult(null);
    setFallbackCombinations([]);
    setFallbackNotice(null);
    setSaveFeedback(null);
    setDetailsOpen(false);
    setOfficialResult(null);
  };

  const generateLocal = async (value: string): Promise<GeneratedCombination[]> => {
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
      throw new ApiError(
        404,
        `Les données du tirage du ${value} ne sont pas encore disponibles.`,
      );
    }

    poolsRef.current = { numbers: numbersPool, stars: starsPool };
    const next = buildCombinations(poolsRef.current);
    if (next.length < COMBINATIONS_COUNT) {
      throw new ApiError(409, "Impossible de générer 5 combinaisons distinctes.");
    }
    return next;
  };

  const loadEngine = async (value: string, seed: number, reset: boolean) => {
    setError(null);
    setSaveFeedback(null);
    if (reset) resetDisplay();
    setGenerating(true);

    try {
      const result = await fetchEngineCombinations(value, {
        seed,
        candidates: CANDIDATES,
        sampling,
      });
      const hasMissingSnapshot =
        Array.isArray(result.warnings) &&
        result.warnings.some((w) =>
          w.toLowerCase().includes("snapshot exact indisponible"),
        );
      if (hasMissingSnapshot) {
        setError(
          `Aucun tirage disponible pour le ${value}. Vérifiez la date : les tirages EuroMillions ont lieu le mardi et le vendredi.`,
        );
        resetDisplay();
        setGenerating(false);
        return;
      }
      if (result.combinations.length !== COMBINATIONS_COUNT) {
        throw new ApiError(409, "Le moteur n'a pas renvoyé 5 combinaisons.");
      }
      setEngineResult(result);
      setFallbackCombinations([]);
      setFallbackNotice(null);
      setRevealKey((key) => key + 1);
    } catch (err) {
      if (isTechnicalFailure(err)) {
        try {
          const local = await generateLocal(value);
          setEngineResult(null);
          setFallbackCombinations(local);
          setFallbackNotice(
            "Moteur statistique indisponible : mode aléatoire de secours utilisé. Ces grilles ne proviennent pas du modèle.",
          );
          setRevealKey((key) => key + 1);
        } catch (fallbackError) {
          setError(describeFetchError(fallbackError, value));
          if (reset) resetDisplay();
        }
      } else {
        setError(describeEngineError(err, value));
        if (reset) resetDisplay();
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleStart = () => {
    const value = date.trim();
    if (!DATE_REGEX.test(value)) {
      setError("Format de date invalide. Utilisez JJ-MM-AAAA (ex: 29-09-2026).");
      resetDisplay();
      return;
    }
    void loadEngine(value, randomSeed(), true);
  };

  const handleReroll = () => {
    setError(null);
    setSaveFeedback(null);
    if (fallbackCombinations.length === COMBINATIONS_COUNT && poolsRef.current) {
      const next = buildCombinations(poolsRef.current);
      if (next.length === COMBINATIONS_COUNT) {
        setFallbackCombinations(next);
        setRevealKey((key) => key + 1);
      }
      return;
    }
    if (!engineResult) {
      handleStart();
      return;
    }
    void loadEngine(date.trim(), randomSeed(), false);
  };

  const handleSave = async () => {
    const payload = engineResult
      ? engineResult.combinations.map(({ numbers, stars }) => ({ numbers, stars }))
      : fallbackCombinations;
    if (payload.length !== COMBINATIONS_COUNT) return;

    setSaving(true);
    setSaveFeedback(null);
    try {
      const response = await saveCombinations(date, payload);
      setSaveFeedback({ kind: "success", message: response.message });
    } catch (err) {
      setSaveFeedback({ kind: "error", message: describeSaveError(err) });
    } finally {
      setSaving(false);
    }
  };

  const displayCombinations: DisplayCombination[] = engineResult
    ? engineResult.combinations.map((combination) => ({
        numbers: combination.numbers,
        stars: combination.stars,
        rank: combination.rank,
        relativeScore: combination.relative_score,
      }))
    : fallbackCombinations;

  const hasCombinations = displayCombinations.length === COMBINATIONS_COUNT;

  const officialNumbers = new Set(officialResult?.numbers ?? []);
  const officialStars = new Set(officialResult?.stars ?? []);
  const hasOfficialResult = Boolean(officialResult);

  useEffect(() => {
    if (!hasCombinations) {
      setOfficialResult(null);
      return;
    }
    let cancelled = false;
    setOfficialResult(null);
    getHistoryDraw(date.trim())
      .then((data) => {
        if (cancelled) return;
        setOfficialResult(data.official ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setOfficialResult(null);
      });
    return () => {
      cancelled = true;
    };
  }, [hasCombinations, date, revealKey]);

  const openDetails = (index: number) => {
    setDetailsFocus(index);
    setDetailsOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageMeta
        title="EuroMillions — Générateur statistique"
        description="Générez cinq grilles EuroMillions à partir des statistiques du tirage, avec score et analyse détaillée."
      />

      <div className="relative overflow-hidden rounded-3xl border border-brand-800/60 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-5 py-10 shadow-theme-lg sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-warning-400/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <h1 className="mt-4 text-title-sm font-bold uppercase tracking-wide text-white sm:text-title-md">
            EuroMillions
          </h1>
          <p className="mt-2 max-w-md text-theme-sm text-blue-100/80">
            Analyse de 10 000 grilles candidates à partir des statistiques du tirage, puis
            sélection des 5 meilleures combinaisons dissimilarisées.
          </p>
        </div>

        <div className="relative mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2">
            <button
              type="button"
              onClick={goToPreviousDraw}
              disabled={generating || saving}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-white/10 px-2 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:px-3 sm:text-sm"
              aria-label="Tirage précédent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Précédent</span>
            </button>

            <label htmlFor="em-date" className="flex items-center">
              <input
                id="em-date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  resetDisplay();
                  setError(null);
                  poolsRef.current = null;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStart();
                }}
                placeholder={todayDate()}
                disabled={generating || saving}
                className="h-10 w-36 rounded-lg border border-white/20 bg-white/10 px-2 text-center text-sm font-semibold tracking-widest text-white placeholder:text-white/40 focus:border-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-300/40 disabled:opacity-60 sm:h-11 sm:w-40 sm:text-base"
              />
            </label>

            <button
              type="button"
              onClick={goToNextDraw}
              disabled={generating || saving}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-white/10 px-2 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:px-3 sm:text-sm"
              aria-label="Tirage suivant"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <select
              value={sampling}
              onChange={(e) => {
                setSampling(e.target.value as "guided" | "uniform" | "ml");
                resetDisplay();
                setError(null);
              }}
              disabled={generating || saving}
              className="h-10 rounded-lg border border-white/20 bg-white/10 px-2 text-xs font-medium text-white focus:border-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-300/40 disabled:opacity-60 sm:h-11 sm:px-3 sm:text-sm"
            >
              <option value="guided" className="bg-brand-900">
                Guidé
              </option>
              <option value="uniform" className="bg-brand-900">
                Uniforme
              </option>
              <option value="ml" className="bg-brand-900">
                Machine Learning (ML)
              </option>
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={generating || saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-warning-300 to-warning-500 px-5 text-sm font-bold uppercase tracking-wider text-brand-950 shadow-theme-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Analyser
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
              Analyse statistique…
            </p>
          </div>
        )}

        {hasCombinations && !generating && (
          <div className="relative mt-8 flex flex-col gap-3" aria-live="polite">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="text-center text-theme-sm font-semibold uppercase tracking-widest text-blue-100/70">
                Vos 5 combinaisons — Tirage du {date}
              </p>
              {engineResult && (
                <button
                  onClick={() => openDetails(0)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-theme-xs font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20"
                >
                  <BarChart3 className="h-4 w-4 text-warning-400" />
                  Analyse détaillée
                </button>
              )}
            </div>

            {engineResult && (
              <div className="rounded-xl bg-white/5 px-3 py-2 text-center text-theme-xs text-blue-100/70 ring-1 ring-white/10">
                Graine {engineResult.seed} ·{" "}
                {engineResult.candidates.toLocaleString("fr-FR")} candidates ·{" "}
                {engineResult.history.draws_used} tirages ·{" "}
                {engineResult.sampling === "guided" ? "guidé" : "uniforme"} ·{" "}
                {engineResult.elapsed_ms.toFixed(0)} ms
              </div>
            )}

            {fallbackNotice && (
              <div className="rounded-xl border border-warning-300/50 bg-warning-400/15 px-3 py-2 text-center text-theme-xs font-medium text-warning-100">
                {fallbackNotice}
              </div>
            )}

            {engineResult && engineResult.warnings.length > 0 && (
              <div className="rounded-xl bg-white/5 px-3 py-2 text-theme-xs text-blue-100/70 ring-1 ring-white/10">
                {engineResult.warnings.join(" · ")}
              </div>
            )}

            {displayCombinations.map((combination, index) => (
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
                      highlighted={hasOfficialResult && officialNumbers.has(number)}
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
                      highlighted={hasOfficialResult && officialStars.has(star)}
                    />
                  ))}
                </div>
                {combination.rank !== undefined && combination.relativeScore !== undefined && (
                  <button
                    onClick={() => openDetails(index)}
                    className="flex shrink-0 flex-col items-start rounded-xl bg-white/10 px-3 py-2 text-left ring-1 ring-white/15 transition hover:bg-white/20 sm:items-end"
                    title="Voir le détail de cette combinaison"
                  >
                    <span className="text-theme-xs font-semibold uppercase tracking-wider text-blue-100/70">
                      Rang {combination.rank}
                    </span>
                    <span className="text-theme-sm font-bold text-warning-300">
                      percentile {combination.relativeScore.toFixed(1)}
                    </span>
                  </button>
                )}
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
              Propositions statistiques — 5 numéros (1 à 50) et 2 étoiles (1 à 12). Aucun score ne
              garantit un gain ; un nouvel enregistrement remplace le précédent.
            </p>
          </div>
        )}
      </div>

      <EngineDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        result={engineResult}
        focused={detailsFocus}
      />
    </div>
  );
}
