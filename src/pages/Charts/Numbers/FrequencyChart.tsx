import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartFrequency from "../../../components/charts/numbers/BarChartFrequency.tsx";

export default function FrequencyChart() {
  return (
    <div>
      <PageMeta
        title="Frequency"
        description="Frequency Chart"
      />
      <PageBreadcrumb pageTitle="Frequency" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Frequency">
          <BarChartFrequency />
        </ComponentCard>
      </div>
    </div>
  );
}
