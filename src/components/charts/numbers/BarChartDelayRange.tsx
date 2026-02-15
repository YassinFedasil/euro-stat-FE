import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type DelayRangeBackendData = { delay_range: string; count: number };

type BarChartDelayRangeProps = {
    onTop10Change?: (top10: [string, number][]) => void;
};

export default function BarChartDelayRange({ onTop10Change }: BarChartDelayRangeProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastDraws, setLastDraws] = useState(25);
    const [error, setError] = useState<string | null>(null);

    const fetchDelaysRange = async (last: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/api/chart-delay-range?last=${last}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const resData: DelayRangeBackendData[] = await res.json();

            console.log("Données reçues:", resData); // Pour debug

            if (!resData || resData.length === 0) {
                setCategories([]);
                setSeriesData([]);
                return;
            }

            // Les données viennent déjà du backend avec count
            // On extrait directement les catégories et les valeurs
            const ranges = resData.map(item => item.delay_range);
            const counts = resData.map(item => item.count);

            setCategories(ranges);
            setSeriesData(counts);

            // Top 10 par occurrences (déjà trié par le backend)
            const top10Data = resData
                .map(item => [item.delay_range, item.count] as [string, number])
                .slice(0, 10);

            onTop10Change?.(top10Data);

        } catch (err: any) {
            console.error("Erreur:", err);
            setError(err.message || "Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDelaysRange(lastDraws);
    }, [lastDraws]);

    // Fonction pour tronquer les labels trop longs
    const truncateLabel = (label: string, maxLength: number = 40) => {
        if (label.length <= maxLength) return label;
        return label.substring(0, maxLength) + "...";
    };

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
                columnWidth: "50%",
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
            title: { text: "Traches des retards" },
            labels: {
                rotate: -45,
                rotateAlways: true,
                style: {
                    fontSize: '11px'
                },
                formatter: (value: string) => truncateLabel(value)
            }
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
        colors: ["#465fff", "#ff8f6b", "#5ac8fa", "#34c759", "#ff2d55"],
        legend: { show: false }
    };

    const series = [{
        name: "Occurrences",
        data: seriesData
    }];

    return (
        <div>
            <div className="flex gap-2 items-center mb-4">
                <label className="font-semibold">{lastDraws} derniers tirages</label>
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
                    <div className="min-w-[700px]">
                        {categories.length > 0 ? (
                            <Chart options={options} series={series} type="bar" height={350} />
                        ) : (
                            <div className="flex justify-center items-center h-[350px] text-gray-500">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}