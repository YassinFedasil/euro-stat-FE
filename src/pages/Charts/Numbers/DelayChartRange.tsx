import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartDelayRange from "../../../components/charts/numbers/BarChartDelayRange.tsx";

export default function DelayChartRange() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    return (
        <div>
            <PageMeta title="Delay Range" description="Delay Range Chart" />
            <PageBreadcrumb pageTitle="Delay Range" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Delay Range">
                    <BarChartDelayRange onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des tranches de retard">
                        <div className="overflow-x-auto">
                            <table className="divide-y divide-gray-200 border border-gray-200 rounded-lg mx-auto">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                                        Tranche
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                                        Occurrences
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {top10.map(([range, count]) => (
                                    <tr key={range} className="hover:bg-gray-50 transition">
                                        <td className="px-6 text-center py-3 text-sm text-gray-800">{range}</td>
                                        <td className="px-6 text-center py-3 text-sm font-semibold text-gray-900">{count} fois</td>
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