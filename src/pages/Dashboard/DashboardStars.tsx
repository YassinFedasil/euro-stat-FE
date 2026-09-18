import PageMeta from "../../components/common/PageMeta";
import BarChart from "../../components/charts/BarChart.tsx";
import {
  CHARTS_BY_ID,
  STARS_CHARTS_LEFT,
  STARS_CHARTS_RIGHT,
} from "../../components/charts/chartConfigs.ts";

export default function DashboardStars() {
  return (
    <>
      <PageMeta
        title="EuroMillions"
        description="This is web site will make you rich !"
      />

      <div className="flex justify-center">
        {/* Container centré */}
        <div className="grid grid-cols-12 gap-6 max-w-10xl w-full">
          {/* Colonne 1 */}
          <div className="col-span-12 xl:col-span-6 space-y-0">
            {STARS_CHARTS_LEFT.map((id) => (
              <div key={id} className="w-full scale-100">
                <BarChart config={CHARTS_BY_ID[id]} />
              </div>
            ))}
          </div>

          {/* Colonne 2 */}
          <div className="col-span-12 xl:col-span-6 space-y-1">
            {STARS_CHARTS_RIGHT.map((id) => (
              <div key={id} className="w-full scale-100">
                <BarChart config={CHARTS_BY_ID[id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
