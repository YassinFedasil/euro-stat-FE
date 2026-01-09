import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type EcartsBackendData = { ecart_reduc: string; count: number };

type BarChartEcartsProps = {
    onTop10Change?: (top10: [string, number][]) => void;
};

export default function BarChartEcarts({ onTop10Change }: BarChartEcartsProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastDraws, setLastDraws] = useState(25);
    const [error, setError] = useState<string | null>(null);

    const fetchEcarts = async (last: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/api/chart-ecarts?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const resData: EcartsBackendData[] = await res.json();

            const counts: Record<string, number> = {};
            resData.forEach((doc) => {
                const val = doc.ecart_reduc;
                const c = doc.count ?? 1;
                if (!val) return;
                counts[val] = (counts[val] || 0) + c;
            });

            // 🔹 Chart (ordre normal par écart)
            const sortedKeys = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
            setCategories(sortedKeys);
            setSeriesData(sortedKeys.map((k) => counts[k]));

            // 🔹 Top 10 par occurrences
            const top10Data = Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10) as [string, number][];

            onTop10Change?.(top10Data);

        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEcarts(lastDraws);
    }, [lastDraws]);

    const options: ApexOptions = {
        chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
        plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 5 } },
        dataLabels: { enabled: false },
        xaxis: { categories, title: { text: "Écarts" } },
        yaxis: { title: { text: "Nombre d'occurrences" } },
        grid: { yaxis: { lines: { show: true } } },
        tooltip: { y: { formatter: (val: number) => val.toString() } },
        fill: { opacity: 1, colors: ["#465fff"] },
    };

    const series = [{ name: "Occurrences", data: seriesData }];

    return (
        <div>
            <div className="flex gap-2 items-center mb-4">
                <label className="font-semibold">{lastDraws}</label>
                <input
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
                <div>Chargement...</div>
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