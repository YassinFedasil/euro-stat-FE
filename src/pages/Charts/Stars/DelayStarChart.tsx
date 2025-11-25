import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartStarDelay from "../../../components/charts/stars/BarChartStarDelay.tsx";

export default function DelayStarChart() {
  return (
    <div>
      <PageMeta
        title="Delay"
        description="Delay Chart"
      />
      <PageBreadcrumb pageTitle="Delay Star" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Delay">
          <BarChartStarDelay />
        </ComponentCard>
      </div>
    </div>
  );
}
