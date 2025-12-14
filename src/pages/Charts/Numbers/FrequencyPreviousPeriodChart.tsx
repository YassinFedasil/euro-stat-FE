import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartFrequencyPreviousPeriod from "../../../components/charts/numbers/BarChartFrequencyPreviousPeriod.tsx";

export default function FrequencyPreviousPeriodChart() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    return (
        <div>
            <PageMeta
                title="Frequency previous period"
                description="Frequency previous period Chart"
            />
            <PageBreadcrumb pageTitle="Frequency previous period" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Frequency previous period">
                    <BarChartFrequencyPreviousPeriod onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des fréquences (période précédente)">
                        <div className="overflow-x-auto">
                            <table className="mx-auto table-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                                        Fréq. Période Préc.
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                                        Occurrences
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {top10.map(([freqPrev, count]) => (
                                    <tr key={freqPrev} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3 text-center text-sm text-gray-800">
                                            {freqPrev}
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
