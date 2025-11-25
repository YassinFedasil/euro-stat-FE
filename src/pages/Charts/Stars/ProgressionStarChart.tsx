import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartStarProgression from "../../../components/charts/stars/BarChartStarProgression.tsx";

export default function ProgressionStarChart() {
  return (
    <div>
      <PageMeta
        title="Progression"
        description="Progression Chart"
      />
      <PageBreadcrumb pageTitle="Progression Star" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Progression">
          <BarChartStarProgression />
        </ComponentCard>
      </div>
    </div>
  );
}
