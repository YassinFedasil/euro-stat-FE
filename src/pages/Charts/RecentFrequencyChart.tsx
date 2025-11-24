import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartRecentFrequency from "../../components/charts/bar/BarChartRecentFrequency.tsx";

export default function RecentFrequencyChart() {
  return (
    <div>
      <PageMeta
        title="RecentFrequency"
        description="Recent Frequency Chart"
      />
      <PageBreadcrumb pageTitle="Recent Frequency" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Recent Frequency">
          <BarChartRecentFrequency />
        </ComponentCard>
      </div>
    </div>
  );
}
