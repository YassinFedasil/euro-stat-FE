import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartStarRecentFrequency from "../../../components/charts/stars/BarChartStarRecentFrequency.tsx";

export default function RecentFrequencyStarChart() {
  return (
    <div>
      <PageMeta
        title="RecentFrequency"
        description="Recent Frequency Chart"
      />
      <PageBreadcrumb pageTitle="Recent Frequency Star" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Recent Frequency">
          <BarChartStarRecentFrequency />
        </ComponentCard>
      </div>
    </div>
  );
}
