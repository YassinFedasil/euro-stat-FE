import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartFrequency from "../../../components/charts/numbers/BarChartFrequency.tsx";

export default function FrequencyChart() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    return (
        <div>
            <PageMeta title="Frequency" description="Frequency Chart" />
            <PageBreadcrumb pageTitle="Frequency" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Frequency">
                    <BarChartFrequency onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des fréquences">
                        <div className="overflow-x-auto">
                            <table className="mx-auto table-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Fréquence</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Occurrences</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {top10.map(([frequency, count]) => (
                                    <tr key={frequency} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3 text-center text-sm text-gray-800">{frequency}</td>
                                        <td className="px-6 py-3 text-center text-sm font-semibold text-gray-900">{count} fois</td>
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
