import { useEffect, useRef, useState } from "react";
import { Star, Dice5, Sparkles } from "lucide-react";
import PageMeta from "../components/common/PageMeta";
import { fetchNumbers, fetchStars } from "../services/euromillionsService";

const DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;

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

function useReveal() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return shown;
}

function NumberBall({ number, delay }: { number: number; delay: number }) {
  const shown = useReveal();
  return (
    <span
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-brand-900 text-xl font-bold text-white shadow-theme-md ring-4 ring-white/15 transition-all duration-300 ease-out sm:h-20 sm:w-20 sm:text-3xl ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-50 opacity-0"
      }`}
    >
      {number}
    </span>
  );
}

function StarBall({ star, delay }: { star: number; delay: number }) {
  const shown = useReveal();
  return (
    <span
      style={{ transitionDelay: `${delay}ms` }}
      className={`relative flex h-14 w-14 items-center justify-center transition-all duration-300 ease-out sm:h-20 sm:w-20 ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-50 opacity-0"
      }`}
    >
      <Star className="h-full w-full fill-warning-400 stroke-warning-500 stroke-[1.5] drop-shadow-lg" />
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-brand-950 sm:text-3xl">
        {star}
      </span>
    </span>
  );
}

export default function EuroMillions() {
  const [date, setDate] = useState<string>(todayDate);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [combination, setCombination] = useState<{ numbers: number[]; stars: number[] } | null>(null);
  const [revealKey, setRevealKey] = useState(0);
  const poolsRef = useRef<{ numbers: number[]; stars: number[] } | null>(null);

  const buildCombination = (): boolean => {
    const pools = poolsRef.current;
    if (!pools) return false;
    const numbers = sampleDistinct(pools.numbers, 5);
    const stars = sampleDistinct(pools.stars, 2);
    if (!isValidCombination(numbers, stars)) return false;
    setCombination({ numbers, stars });
    setRevealKey((k) => k + 1);
    return true;
  };

  const handleStart = async () => {
    const value = date.trim();
    if (!DATE_REGEX.test(value)) {
      setError("Format de date invalide. Utilisez JJ-MM-AAAA (ex: 29-09-2026).");
      setCombination(null);
      return;
    }

    setError(null);
    setGenerating(true);
    setCombination(null);

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
        setError(`⚠️ Impossible de récupérer les données pour le ${value}.`);
        return;
      }

      poolsRef.current = { numbers: numbersPool, stars: starsPool };
      buildCombination();
    } catch {
      setError(`⚠️ Impossible de récupérer les données pour le ${value}.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleReroll = () => {
    setError(null);
    if (!poolsRef.current) {
      void handleStart();
      return;
    }
    buildCombination();
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageMeta
        title="EuroMillions — Générateur de combinaison"
        description="Générez une grille EuroMillions aléatoire pour la date de votre choix."
      />

      <div className="relative overflow-hidden rounded-3xl border border-brand-800/60 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-5 py-10 shadow-theme-lg sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-warning-400/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <h1 className="mt-4 text-title-sm font-bold uppercase tracking-wide text-white sm:text-title-md">
            EuroMillions
          </h1>
          <p className="mt-2 max-w-md text-theme-sm text-blue-100/80">
            Générez une combinaison aléatoire pour le tirage de votre choix.
          </p>
        </div>

        <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <label htmlFor="em-date" className="flex flex-col items-center gap-1.5 sm:items-end">
            <input
              id="em-date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCombination(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleStart();
              }}
              placeholder={todayDate()}
              disabled={generating}
              className="h-13 w-44 rounded-xl border border-white/20 bg-white/10 px-4 text-center text-lg font-semibold tracking-widest text-white placeholder:text-white/40 focus:border-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-300/40 disabled:opacity-60 sm:h-14 sm:w-48 sm:text-xl"
            />
          </label>

          <button
            onClick={() => void handleStart()}
            disabled={generating}
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

        {combination && !generating && (
          <div className="relative mt-10 flex flex-col items-center gap-6" aria-live="polite">
            <p className="text-theme-sm font-semibold uppercase tracking-widest text-blue-100/70">
              Votre combinaison — Tirage du {date}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {combination.numbers.map((number, index) => (
                <NumberBall key={`${revealKey}-${number}`} number={number} delay={index * 130} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {combination.stars.map((star, index) => (
                <StarBall
                  key={`${revealKey}-s${star}`}
                  star={star}
                  delay={(combination.numbers.length + index) * 130}
                />
              ))}
            </div>

            <button
              onClick={handleReroll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-theme-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20 active:scale-95"
            >
              <Dice5 className="h-5 w-5 text-warning-400" />
              Nouvelle combinaison
            </button>

            <p className="text-theme-xs text-blue-100/60">
              Tirage 100 % aléatoire · 5 numéros (1–50) · 2 étoiles (1–12)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
