import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartRecentFrequency from "../../../components/charts/numbers/BarChartRecentFrequency.tsx";

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
