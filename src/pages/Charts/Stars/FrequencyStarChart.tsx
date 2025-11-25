import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartStarFrequency from "../../../components/charts/stars/BarChartStarFrequency.tsx";

export default function FrequencyStarChart() {
  return (
    <div>
      <PageMeta
        title="Frequency"
        description="Frequency Chart"
      />
      <PageBreadcrumb pageTitle="Frequency Star" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Frequency">
          <BarChartStarFrequency />
        </ComponentCard>
      </div>
    </div>
  );
}
