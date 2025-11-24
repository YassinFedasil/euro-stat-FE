import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartOut from "../../components/charts/bar/BarChartOut.tsx";

export default function OutChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Outs" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Out">
          <BarChartOut />
        </ComponentCard>
      </div>
    </div>
  );
}
