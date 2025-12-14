import PageMeta from "../../components/common/PageMeta";

import BarChartStarDelay from "../../components/charts/stars/BarChartStarDelay.tsx";
import BarChartStarRecentFrequency from "../../components/charts/stars/BarChartStarRecentFrequency.tsx";
import BarChartStarFrequency from "../../components/charts/stars/BarChartStarFrequency.tsx";
import BarChartStarProgression from "../../components/charts/stars/BarChartStarProgression.tsx";
import BarChartStarFrequencyPreviousPeriod from "../../components/charts/stars/BarChartFrequencyStarPreviousPeriod.tsx";

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
                        <div className="w-full scale-100">
                            <BarChartStarRecentFrequency/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartStarDelay/>
                        </div>
                    </div>

                    {/* Colonne 2 */}
                    <div className="col-span-12 xl:col-span-6 space-y-1">
                        <div className="w-full scale-100">
                            <BarChartStarProgression/>
                        </div>

                        <div className="w-full scale-100">
                            < BarChartStarFrequencyPreviousPeriod/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartStarFrequency/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
