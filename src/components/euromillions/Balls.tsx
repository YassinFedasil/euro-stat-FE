import { useEffect, useState } from "react";
import { Star } from "lucide-react";

function useReveal() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return shown;
}

interface BallProps {
  number: number;
  delay?: number;
  highlighted?: boolean;
  compact?: boolean;
}

export function NumberBall({ number, delay = 0, highlighted = false, compact = false }: BallProps) {
  const shown = useReveal();
  const palette = highlighted
    ? "from-emerald-500 to-emerald-700 ring-emerald-300/30"
    : "from-blue-600 to-brand-900 ring-white/15";
  const size = compact ? "h-10 w-10 text-base sm:h-12 sm:w-12 sm:text-lg" : "h-14 w-14 text-xl sm:h-20 sm:w-20 sm:text-3xl";

  return (
    <span
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex items-center justify-center rounded-xl bg-linear-to-br ${palette} font-bold text-white shadow-theme-md ring-4 ${size} transition-all duration-300 ease-out ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-50 opacity-0"
      }`}
    >
      {number}
    </span>
  );
}

export function StarBall({ number, delay = 0, highlighted = false, compact = false }: BallProps) {
  const shown = useReveal();
  const icon = highlighted
    ? "fill-emerald-400 stroke-emerald-600"
    : "fill-warning-400 stroke-warning-500";
  const text = highlighted ? "text-emerald-950" : "text-brand-950";
  const size = compact ? "h-10 w-10 sm:h-12 sm:w-12" : "h-14 w-14 sm:h-20 sm:w-20";
  const textSize = compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl";

  return (
    <span
      style={{ transitionDelay: `${delay}ms` }}
      className={`relative flex items-center justify-center transition-all duration-300 ease-out ${size} ${
        shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-50 opacity-0"
      }`}
    >
      <Star className={`h-full w-full stroke-[1.5] drop-shadow-lg ${icon}`} />
      <span className={`absolute inset-0 flex items-center justify-center font-extrabold ${text} ${textSize}`}>
        {number}
      </span>
    </span>
  );
}
