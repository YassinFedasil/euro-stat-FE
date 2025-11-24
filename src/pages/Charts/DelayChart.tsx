import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartDelay from "../../components/charts/bar/BarChartDelay.tsx";

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
