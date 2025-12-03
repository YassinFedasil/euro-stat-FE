import PageMeta from "../../components/common/PageMeta";
import BarChartReport from "../../components/charts/numbers/BarChartReport.tsx";
import BarChartOut from "../../components/charts/numbers/BarChartOut.tsx";
import BarChartEcarts from "../../components/charts/numbers/BarChartEcarts.tsx";
import BarChartFrequency from "../../components/charts/numbers/BarChartFrequency.tsx";
import BarChartFrequencyPreviousPeriod from "../../components/charts/numbers/BarChartFrequencyPreviousPeriod.tsx";
import BarChartProgression from "../../components/charts/numbers/BarChartProgression.tsx";
import BarChartRecentFrequency from "../../components/charts/numbers/BarChartRecentFrequency.tsx";
import BarChartDelay from "../../components/charts/numbers/BarChartDelay.tsx";

export default function Home() {
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
                            <BarChartOut/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartEcarts/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartRecentFrequency/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartFrequency/>
                        </div>
                    </div>

                    {/* Colonne 2 */}
                    <div className="col-span-12 xl:col-span-6 space-y-1">
                        <div className="w-full scale-100">
                            <BarChartReport/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartProgression/>
                        </div>

                        <div className="w-full scale-100">
                            < BarChartFrequencyPreviousPeriod/>
                        </div>

                        <div className="w-full scale-100">
                            <BarChartDelay/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
