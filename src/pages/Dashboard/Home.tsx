import PageMeta from "../../components/common/PageMeta";
import BarChartReport from "../../components/charts/numbers/BarChartReport.tsx";
import BarChartOut from "../../components/charts/numbers/BarChartOut.tsx";
import BarChartEcarts from "../../components/charts/numbers/BarChartEcarts.tsx";

export default function Home() {
  return (
      <>
        <PageMeta
            title="EuroMillions"
            description="This is web site will make you rich !"
        />

        <div className="w-full flex justify-center">
          {/* Container centré */}
          <div className="grid grid-cols-12 gap-6 max-w-6xl w-full">

            {/* Colonne 1 */}
            <div className="col-span-12 xl:col-span-6 space-y-0">
              <div className="w-full scale-70">
                <BarChartOut/>
              </div>

              <div className="w-full scale-70">
                <BarChartReport/>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="col-span-12 xl:col-span-6 space-y-1">
              <div className="w-full scale-70">
                <BarChartEcarts/>
              </div>

              <div className="w-full scale-70">
                <BarChartReport/>
              </div>
            </div>

          </div>
        </div>
      </>
  );
}
