import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartDelay from "../../../components/charts/numbers/BarChartDelay.tsx";

export default function DelayChart() {
  return (
    <div>
      <PageMeta
        title="Delay"
        description="Delay Chart"
      />
      <PageBreadcrumb pageTitle="Delay" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Delay">
          <BarChartDelay />
        </ComponentCard>
      </div>
    </div>
  );
}
