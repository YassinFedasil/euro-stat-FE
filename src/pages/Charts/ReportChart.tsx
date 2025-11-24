import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BarChartReport from "../../components/charts/bar/BarChartReport";

export default function ReportChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Report" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Report">
          <BarChartReport />
        </ComponentCard>
      </div>
    </div>
  );
}
