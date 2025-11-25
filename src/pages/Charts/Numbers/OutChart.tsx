import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import BarChartOut from "../../../components/charts/numbers/BarChartOut.tsx";

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
