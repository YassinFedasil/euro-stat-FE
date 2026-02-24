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

    /* 🔥 AUTO RESET SI GLOBAL CHANGE */
    const [prevGlobal, setPrevGlobal] = useState(globalLastDraws);

    useEffect(() => {
        if (globalLastDraws !== prevGlobal) {
            setLocalLastDraws(null);
            setPrevGlobal(globalLastDraws);
        }
    }, [globalLastDraws, prevGlobal]);

    const fetchEcartsRange = async (last: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8000/api/chart-ecarts-range?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData: EcartsRangeBackendData[] = await res.json();

            if (!resData || resData.length === 0) {
                setCategories([]);
                setSeriesData([]);
                return;
            }

            const ranges = resData.map(item => item.ecart_range);
            const counts = resData.map(item => item.count);

            setCategories(ranges);
            setSeriesData(counts);

            const top10Data = resData
                .map(item => [item.ecart_range, item.count] as [string, number])
                .slice(0, 10);

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
            fetchEcartsRange(effectiveLastDraws);
        }, 300);

        return () => clearTimeout(timer);
    }, [effectiveLastDraws]);

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 450,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "60%",
                borderRadius: 5,
                distributed: true
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                colors: ['#304758']
            },
            offsetY: -20,
            formatter: (val: number) => val.toString()
        },
        xaxis: {
            categories,
            title: { text: "Tranches d'écarts" },
            labels: {
                rotate: -45,
                rotateAlways: true,
                style: {
                    fontSize: '11px',
                    fontWeight: 500
                }
            },
            tickPlacement: "on",
            axisTicks: { show: true },
            axisBorder: { show: true }
        },
        yaxis: {
            title: { text: "Nombre d'occurrences" },
            min: 0
        },
        grid: {
            yaxis: { lines: { show: true } }
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toString() + " fois"
            }
        },
        fill: {
            opacity: 1,
            colors: ["#465fff"]
        },
        colors: [
            "#465fff",
            "#ff8f6b",
            "#5ac8fa",
            "#34c759",
            "#ff2d55",
            "#af52de",
            "#ff9f0a",
            "#bf5b4d",
            "#66a3ff",
            "#ff6b6b"
        ],
        legend: { show: false }
    };

    const series = [{
        name: "Occurrences",
        data: seriesData
    }];

    return (
        <div>
            {/* 🔥 SLIDER */}
            <div className="flex gap-2 items-center mb-4">
                <label className="font-semibold whitespace-nowrap">
                    {effectiveLastDraws} derniers tirages
                </label>

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
                <div className="flex justify-center items-center h-[450px]">
                    Chargement...
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[900px]">
                        {categories.length > 0 ? (
                            <Chart options={options} series={series} type="bar" height={450} />
                        ) : (
                            <div className="flex justify-center items-center h-[450px] text-gray-500">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}