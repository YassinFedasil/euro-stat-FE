import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartProgression from "../../../components/charts/numbers/BarChartProgression.tsx";

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
