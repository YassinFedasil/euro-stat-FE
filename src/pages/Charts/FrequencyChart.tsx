import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartFrequency from "../../components/charts/bar/BarChartFrequency.tsx";

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
