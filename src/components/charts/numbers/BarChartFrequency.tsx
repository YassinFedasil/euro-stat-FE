import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type FrequencyBackendData = { frequency: string; count: number };

type BarChartFrequencyProps = {
    onTop10Change?: (top10: [string, number][]) => void;
};

type LayoutContext = {
    globalLastDraws: number;
};

export default function BarChartFrequency({ onTop10Change }: BarChartFrequencyProps) {
    const { globalLastDraws } = useOutletContext<LayoutContext>();

    const [categories, setCategories] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const [localLastDraws, setLocalLastDraws] = useState<number | null>(null);

    const effectiveLastDraws = localLastDraws ?? globalLastDraws;

    const [error, setError] = useState<string | null>(null);

    /* 🔥 RESET AUTO (version simple et propre) */
    useEffect(() => {
        setLocalLastDraws(null);
    }, [globalLastDraws]);

    const fetchFrequency = async (last: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8000/api/chart-frequency?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData: FrequencyBackendData[] = await res.json();

            const counts: Record<string, number> = {};

            resData.forEach((doc) => {
                const val = doc.frequency;
                const c = doc.count ?? 1;
                if (!val) return;
                counts[val] = (counts[val] || 0) + c;
            });

            const sortedKeys = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
            setCategories(sortedKeys);
            setSeriesData(sortedKeys.map((k) => counts[k]));

            const top10Data = Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10) as [string, number][];

            onTop10Change?.(top10Data);

        } catch (err: any) {
            setError(err.message || "Erreur");
        } finally {
            setLoading(false);
        }
    };

    /* 🔥 DEBOUNCE */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFrequency(effectiveLastDraws);
        }, 300);

        return () => clearTimeout(timer);
    }, [effectiveLastDraws]);

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif"
        },
        plotOptions: {
            bar: { horizontal: false, columnWidth: "40%", borderRadius: 5 }
        },
        dataLabels: { enabled: false },
        xaxis: { categories, title: { text: "Fréquences" } },
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

                {localLastDraws !== null && (
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