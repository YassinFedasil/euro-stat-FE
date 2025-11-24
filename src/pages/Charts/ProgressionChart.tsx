import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartProgression from "../../components/charts/bar/BarChartProgression.tsx";

export default function ProgressionChart() {
  return (
    <div>
      <PageMeta
        title="Progression"
        description="Progression Chart"
      />
      <PageBreadcrumb pageTitle="Progression" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Progression">
          <BarChartProgression />
        </ComponentCard>
      </div>
    </div>
  );
}
