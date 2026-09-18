import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { API_BASE_URL } from "../../config";
import type { ChartConfig } from "./chartConfigs";

type LayoutContext = {
  globalLastDraws: number;
};

type BackendRow = Record<string, unknown>;

type BarChartProps = {
  config: ChartConfig;
  onTop10Change?: (top10: [string, number][]) => void;
};

const truncateLabel = (label: string, maxLength = 40) =>
  label.length <= maxLength ? label : label.substring(0, maxLength) + "...";

export default function BarChart({ config, onTop10Change }: BarChartProps) {
  const isStars = config.scope === "stars";
  const mode = config.mode ?? "aggregate";
  const variant = config.variant ?? "default";
  const sortMode = config.sortMode ?? "numeric";
  const guard = config.guard ?? "falsy";

  const context = useOutletContext<LayoutContext | undefined>();
  const globalLastDraws = context?.globalLastDraws ?? 25;

  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localLastDraws, setLocalLastDraws] = useState<number | null>(
    isStars ? 25 : null,
  );

  const effectiveLastDraws = isStars
    ? (localLastDraws ?? 25)
    : (localLastDraws ?? globalLastDraws);

  useEffect(() => {
    if (!isStars) setLocalLastDraws(null);
  }, [globalLastDraws, isStars]);

  useEffect(() => {
    setCategories([]);
    setSeriesData([]);
    setError(null);
    setLocalLastDraws(isStars ? 25 : null);
  }, [config.endpoint, isStars]);

  const fetchData = async (last: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/${config.endpoint}?last=${last}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const resData: BackendRow[] = await res.json();

      if (!Array.isArray(resData)) {
        throw new Error("Données reçues invalides");
      }

      if (mode === "direct") {
        const items = resData.map((row) => [String(row[config.dataKey]), Number(row.count)] as [string, number]);
        setCategories(items.map(([label]) => label));
        setSeriesData(items.map(([, count]) => count));
        onTop10Change?.(items.slice(0, 10));
        return;
      }

      const counts: Record<string, number> = {};

      resData.forEach((row) => {
        const val = row[config.dataKey];
        const increment = (row.count as number | undefined) ?? 1;
        if (guard === "falsy" ? !val : val === undefined || val === null) return;
        const key = String(val);
        counts[key] = (counts[key] || 0) + increment;
      });

      const sortedKeys = Object.keys(counts).sort((a, b) => {
        if (sortMode === "localeFallback") {
          const nA = Number(a);
          const nB = Number(b);
          return !isNaN(nA) && !isNaN(nB) ? nA - nB : a.localeCompare(b);
        }
        return Number(a) - Number(b);
      });

      setCategories(sortedKeys);
      setSeriesData(sortedKeys.map((key) => counts[key]));

      const top10Data = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) as [string, number][];

      onTop10Change?.(top10Data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStars) {
      void fetchData(effectiveLastDraws);
      return;
    }

    const timer = setTimeout(() => {
      void fetchData(effectiveLastDraws);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveLastDraws, isStars, config.endpoint]);

  const options: ApexOptions =
    variant === "distributed"
      ? {
          chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
          },
          plotOptions: {
            bar: { horizontal: false, columnWidth: "50%", borderRadius: 5, distributed: true },
          },
          dataLabels: {
            enabled: true,
            style: { fontSize: "12px", colors: ["#304758"] },
            offsetY: -20,
            formatter: (val: number) => val.toString(),
          },
          xaxis: {
            categories,
            title: { text: config.xAxisTitle },
            labels: {
              rotate: -45,
              rotateAlways: true,
              style: { fontSize: "11px" },
              formatter: (value: string) => truncateLabel(value),
            },
          },
          yaxis: { title: { text: "Nombre d'occurrences" }, min: 0 },
          grid: { yaxis: { lines: { show: true } } },
          tooltip: { y: { formatter: (val: number) => val.toString() + " fois" } },
          fill: { opacity: 1, colors: ["#465fff"] },
          colors: ["#465fff", "#ff8f6b", "#5ac8fa", "#34c759", "#ff2d55"],
          legend: { show: false },
        }
      : {
          chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
          },
          plotOptions: {
            bar: { horizontal: false, columnWidth: "40%", borderRadius: 5 },
          },
          dataLabels: { enabled: false },
          xaxis: { categories, title: { text: config.xAxisTitle } },
          yaxis: { title: { text: "Nombre d'occurrences" } },
          grid: { yaxis: { lines: { show: true } } },
          tooltip: { y: { formatter: (val: number) => val.toString() } },
          fill: { opacity: 1, colors: ["#465fff"] },
        };

  const series = [{ name: "Occurrences", data: seriesData }];

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <label className="font-semibold">{effectiveLastDraws}</label>

        <input
          type="range"
          min={1}
          max={100}
          value={effectiveLastDraws}
          onChange={(e) => setLocalLastDraws(Number(e.target.value))}
          className="w-full"
        />

        {!isStars && localLastDraws !== null && (
          <button
            onClick={() => setLocalLastDraws(null)}
            className="text-xs text-blue-500 whitespace-nowrap"
          >
            Use global
          </button>
        )}
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div>{isStars ? "Chargement..." : "Chargement du graphique..."}</div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className={variant === "distributed" ? "min-w-[700px]" : "min-w-[600px]"}>
            {variant === "distributed" && categories.length === 0 ? (
              <div className="flex justify-center items-center h-[350px] text-gray-500">
                Aucune donnée disponible
              </div>
            ) : (
              <Chart options={options} series={series} type="bar" height={350} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
