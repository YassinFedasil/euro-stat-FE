import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartOutRange from "../../../components/charts/numbers/BarChartOutRange.tsx";

export default function OutChartRange() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    // Fonction pour tronquer les labels trop longs
    const truncateLabel = (label: string, maxLength: number = 100) => {
        if (label.length <= maxLength) return label;
        return label.substring(0, maxLength) + "...";
    };

    return (
        <div>
            <PageMeta title="Outs Range" description="Outs Range Chart" />
            <PageBreadcrumb pageTitle="Outs Range" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Outs Range">
                    <BarChartOutRange onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des combinaisons de sorties">
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
                            {top10.some(([range]) => range.length > 100) && (
                                <div className="text-xs text-gray-500 mt-2 text-center">
                                    * Les combinaisons très longues sont tronquées avec "..."
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                )}
            </div>
        </div>
    );
}