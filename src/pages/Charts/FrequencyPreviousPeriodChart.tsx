import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartFrequencyPreviousPeriod from "../../components/charts/bar/BarChartFrequencyPreviousPeriod.tsx";

export default function FrequencyPreviousPeriodChart() {
  return (
    <div>
      <PageMeta
        title="Frequency previous period"
        description="Frequency previous period Chart"
      />
      <PageBreadcrumb pageTitle="Frequency previous period" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Frequency previous period">
          <BarChartFrequencyPreviousPeriod />
        </ComponentCard>
      </div>
    </div>
  );
}
