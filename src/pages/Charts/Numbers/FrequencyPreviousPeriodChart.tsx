import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartFrequencyPreviousPeriod from "../../../components/charts/numbers/BarChartFrequencyPreviousPeriod.tsx";

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
