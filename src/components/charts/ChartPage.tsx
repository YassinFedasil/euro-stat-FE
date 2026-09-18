import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import BarChart from "./BarChart";
import type { ChartConfig } from "./chartConfigs";

type ChartPageProps = {
  config: ChartConfig;
};

const truncateLabel = (label: string, maxLength = 40) =>
  label.length <= maxLength ? label : label.substring(0, maxLength) + "...";

export default function ChartPage({ config }: ChartPageProps) {
  const [top10, setTop10] = useState<[string, number][]>([]);

  useEffect(() => {
    setTop10([]);
  }, [config.id]);

  const alignClass = config.top10Align === "left" ? "text-left" : "text-center";
  const headerClass = `px-6 py-3 ${alignClass} text-sm font-medium text-gray-700${
    config.top10Uppercase ? " uppercase" : ""
  }`;
  const labelClass = `px-6 py-3 text-center text-sm text-gray-800${
    config.top10Monospace ? " font-mono" : ""
  }`;

  return (
    <div>
      <PageMeta title={config.metaTitle} description={config.metaDescription} />
      <PageBreadcrumb pageTitle={config.breadcrumb} />

      <div className="space-y-6">
        <ComponentCard title={config.cardTitle}>
          <BarChart config={config} onTop10Change={setTop10} />
        </ComponentCard>

        {top10.length > 0 && (
          <ComponentCard title={config.top10Title}>
            <div className="overflow-x-auto">
              <table className="mx-auto table-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className={headerClass}>{config.top10Label}</th>
                    <th className={headerClass}>Occurrences</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {top10.map(([label, count]) => (
                    <tr key={label} className="hover:bg-gray-50 transition">
                      <td className={labelClass}>
                        {config.top10Truncate ? truncateLabel(label) : label}
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
