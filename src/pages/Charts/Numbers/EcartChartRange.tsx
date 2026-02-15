import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartEcartsRange from "../../../components/charts/numbers/BarChartEcartsRange.tsx";

export default function EcartChartRange() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    // Fonction pour tronquer les labels trop longs
    const truncateLabel = (label: string, maxLength: number = 40) => {
        if (label.length <= maxLength) return label;
        return label.substring(0, maxLength) + "...";
    };

    return (
        <div>
            <PageMeta title="Ecarts Range" description="Ecarts Range Chart" />
            <PageBreadcrumb pageTitle="Ecarts Range" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Ecarts Range">
                    <BarChartEcartsRange onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des combinaisons d'écarts">
                        <div className="overflow-x-auto">
                            <table className="mx-auto table-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase">
                                        Combinaison
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase">
                                        Occurrences
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {top10.map(([range, count]) => (
                                    <tr key={range} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3 text-center text-sm text-gray-800 font-mono">
                                            {truncateLabel(range)}
                                        </td>
                                        <td className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                                            {count} fois
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </ComponentCard>
                )}
            </div>
        </div>
    );
}