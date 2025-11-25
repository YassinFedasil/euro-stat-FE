import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartStarFrequencyPreviousPeriod
    from "../../../components/charts/stars/BarChartFrequencyStarPreviousPeriod.tsx";

export default function FrequencyPreviousPeriodStarChart() {
  return (
    <div>
      <PageMeta
        title="Frequency previous period"
        description="Frequency previous period Chart"
      />
      <PageBreadcrumb pageTitle="Frequency previous period Star" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Frequency previous period">
          <BarChartStarFrequencyPreviousPeriod />
        </ComponentCard>
      </div>
    </div>
  );
}
