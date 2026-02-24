import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type EcartsRangeBackendData = { ecart_range: string; count: number };

type BarChartEcartsRangeProps = {
    onTop10Change?: (top10: [string, number][]) => void;
};

/* 🔥 CONTEXT GLOBAL */
type LayoutContext = {
    globalLastDraws: number;
};

export default function BarChartEcartsRange({ onTop10Change }: BarChartEcartsRangeProps) {
    const { globalLastDraws } = useOutletContext<LayoutContext>();

    const [categories, setCategories] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    /* 🔥 LOCAL OVERRIDE */
    const [localLastDraws, setLocalLastDraws] = useState<number | null>(null);

    /* 🔥 EFFECTIVE VALUE */
    const effectiveLastDraws = localLastDraws ?? globalLastDraws;

    const [error, setError] = useState<string | null>(null);

    /* 🔥 RESET SIMPLE (comme Report) */
    useEffect(() => {
        setLocalLastDraws(null);
    }, [globalLastDraws]);

    const fetchEcartsRange = async (last: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8000/api/chart-ecarts-range?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData: EcartsRangeBackendData[] = await res.json();

            const ranges = resData.map(item => item.ecart_range);
            const counts = resData.map(item => item.count);

            setCategories(ranges);
            setSeriesData(counts);

            const top10 = resData
                .map(item => [item.ecart_range, item.count] as [string, number])
                .slice(0, 10);

            onTop10Change?.(top10);

        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    /* 🔥 DEBOUNCE */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEcartsRange(effectiveLastDraws);
        }, 300);

        return () => clearTimeout(timer);
    }, [effectiveLastDraws]);

    /* 🔥 STYLE IDENTIQUE AU REPORT */
    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "40%",
                borderRadius: 5
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories,
            title: { text: "Tranches d'écarts" }
        },
        yaxis: {
            title: { text: "Nombre d'occurrences" }
        },
        grid: {
            yaxis: { lines: { show: true } }
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toString()
            }
        },
        fill: {
            opacity: 1,
            colors: ["#465fff"]
        }
    };

    const series = [{
        name: "Occurrences",
        data: seriesData
    }];

    return (
        <div>
            {/* 🔥 SLIDER */}
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