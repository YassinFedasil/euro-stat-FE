import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartEcarts from "../../../components/charts/numbers/BarChartEcarts.tsx";

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
