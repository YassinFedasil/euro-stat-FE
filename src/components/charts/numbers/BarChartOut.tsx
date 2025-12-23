import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type OutBackendData = {
  out_reduc: string;
  count: number;
};

type BarChartOutProps = {
  onTop10Change?: (top10: [string, number][]) => void;
};

export default function BarChartOut({ onTop10Change }: BarChartOutProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDraws, setLastDraws] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const fetchOuts = async (last: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/chart-out?last=${last}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const resData: OutBackendData[] = await res.json();
      if (!Array.isArray(resData)) {
        throw new Error("Données reçues invalides");
      }

      // Compter occurrences
      const counts: Record<string, number> = {};
      resData.forEach((doc) => {
        const val = doc.out_reduc;
        const c = doc.count ?? 1;
        if (val === undefined || val === null) return;
        counts[val] = (counts[val] || 0) + c;
      });

      // 🔹 Chart : ordre naturel
      const sortedKeys = Object.keys(counts).sort((a, b) => {
        const nA = Number(a);
        const nB = Number(b);
        return !isNaN(nA) && !isNaN(nB) ? nA - nB : a.localeCompare(b);
      });

      setCategories(sortedKeys);
      setSeriesData(sortedKeys.map((k) => counts[k]));

      // 🔹 Top 10 par occurrences
      const top10Data = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10) as [string, number][];

      onTop10Change?.(top10Data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOuts(lastDraws);
  }, [lastDraws]);

  const options: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 5 } },
    dataLabels: { enabled: false },
    xaxis: { categories, title: { text: "Sorties" } },
    yaxis: { title: { text: "Nombre d'occurrences" } },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (val: number) => val.toString() } },
    fill: { opacity: 1, colors: ["#465fff"] },
  };

  const series = [{ name: "Occurrences", data: seriesData }];

  return (
      <div>
        <div className="flex gap-2 items-center mb-4">
          <label htmlFor="lastDraws" className="font-semibold">
            {lastDraws}
          </label>
          <input
              id="lastDraws"
              type="range"
              min={1}
              max={100}
              value={lastDraws}
              onChange={(e) => setLastDraws(Number(e.target.value))}
              className="w-full"
          />
        </div>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        {loading ? (
            <div>Chargement du graphique...</div>
        ) : (
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px]">
                <Chart options={options} series={series} type="bar" height={350} />
              </div>
            </div>
        )}
      </div>
  );
}
