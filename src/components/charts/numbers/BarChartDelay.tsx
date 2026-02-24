import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type DelayBackendData = { delay: string; count: number };

type BarChartDelayProps = {
    onTop10Change?: (top10: [string, number][]) => void;
};

/* 🔥 CONTEXT GLOBAL */
type LayoutContext = {
    globalLastDraws: number;
};

export default function BarChartDelay({ onTop10Change }: BarChartDelayProps) {
    const { globalLastDraws } = useOutletContext<LayoutContext>();

    const [categories, setCategories] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    /* 🔥 LOCAL OVERRIDE */
    const [localLastDraws, setLocalLastDraws] = useState<number | null>(null);

    /* 🔥 EFFECTIVE VALUE */
    const effectiveLastDraws = localLastDraws ?? globalLastDraws;

    const [error, setError] = useState<string | null>(null);

    /* 🔥 DETECT GLOBAL CHANGE (auto reset override) */
    const [prevGlobal, setPrevGlobal] = useState(globalLastDraws);

    useEffect(() => {
        if (globalLastDraws !== prevGlobal) {
            setLocalLastDraws(null); // reset override
            setPrevGlobal(globalLastDraws);
        }
    }, [globalLastDraws, prevGlobal]);

    const fetchDelays = async (last: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8000/api/chart-delay?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData: DelayBackendData[] = await res.json();

            const counts: Record<string, number> = {};

            resData.forEach((doc) => {
                const val = doc.delay;
                const c = doc.count ?? 1;
                if (!val) return;
                counts[val] = (counts[val] || 0) + c;
            });

            // 🔹 Chart
            const sortedKeys = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
            setCategories(sortedKeys);
            setSeriesData(sortedKeys.map((k) => counts[k]));

            // 🔹 Top 10
            const top10Data = Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10) as [string, number][];

            onTop10Change?.(top10Data);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    /* 🔥 DEBOUNCE */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDelays(effectiveLastDraws);
        }, 300);

        return () => clearTimeout(timer);
    }, [effectiveLastDraws]);

    const options: ApexOptions = {
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
        xaxis: { categories, title: { text: "Delays" } },
        yaxis: { title: { text: "Nombre d'occurrences" } },
        grid: { yaxis: { lines: { show: true } } },
        tooltip: { y: { formatter: (val: number) => val.toString() } },
        fill: { opacity: 1, colors: ["#465fff"] },
    };

    const series = [{ name: "Occurrences", data: seriesData }];

    return (
        <div>
            {/* 🔥 SLIDER LOCAL */}
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

                {/* 🔥 OPTIONNEL */}
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