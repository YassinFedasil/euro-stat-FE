import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartDelay from "../../../components/charts/numbers/BarChartDelay.tsx";

export default function DelayChart() {
    const [top10, setTop10] = useState<[string, number][]>([]);

    return (
        <div>
            <PageMeta title="Delay" description="Delay Chart" />
            <PageBreadcrumb pageTitle="Delay" />

            <div className="space-y-6">
                <ComponentCard title="Bar Chart Delay">
                    <BarChartDelay onTop10Change={setTop10} />
                </ComponentCard>

                {top10.length > 0 && (
                    <ComponentCard title="Top 10 des retards">
                        <div className="overflow-x-auto">
                            <table className="divide-y divide-gray-200 border border-gray-200 rounded-lg mx-auto">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                                        Retard
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                                        Occurrences
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {top10.map(([delay, count]) => (
                                    <tr key={delay} className="hover:bg-gray-50 transition">
                                        <td className="px-6 text-center py-3 text-sm text-gray-800">{delay}</td>
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
