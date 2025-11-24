import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartEcarts from "../../components/charts/bar/BarChartEcarts.tsx";

export default function EcartChart() {
  return (
    <div>
      <PageMeta
        title="Ecarts"
        description="Ecarts Chart"
      />
      <PageBreadcrumb pageTitle="Ecarts" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Ecarts">
          <BarChartEcarts />
        </ComponentCard>
      </div>
    </div>
  );
}
