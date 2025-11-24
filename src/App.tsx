import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Statistics from "./pages/Statistics.tsx";
import Numbers from "./pages/Numbers.tsx";
import Stars from "./pages/Stars.tsx";
import ReportChart from "./pages/Charts/ReportChart.tsx";
import OutChart from "./pages/Charts/OutChart.tsx";
import ProgressionChart from "./pages/Charts/ProgressionChart.tsx";
import DelayChart from "./pages/Charts/DelayChart.tsx";
import EcartChart from "./pages/Charts/EcartChart.tsx";
import FrequencyChart from "./pages/Charts/FrequencyChart.tsx";
import FrequencyPreviousPeriodChart from "./pages/Charts/FrequencyPreviousPeriodChart.tsx";
import RecentFrequencyChart from "./pages/Charts/RecentFrequencyChart.tsx";
import Export from "./pages/Export.tsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/numbers" element={<Numbers />} />
            <Route path="/stars" element={<Stars />} />
            <Route path="/export" element={<Export />} />

            <Route path="/blank" element={<Blank />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/bar-chart-report" element={<ReportChart />} />
            <Route path="/bar-chart-out" element={<OutChart />} />
            <Route path="/bar-chart-delay" element={<DelayChart />} />
            <Route path="/bar-chart-progression" element={<ProgressionChart />} />
            <Route path="/bar-chart-frequency" element={<FrequencyChart />} />
            <Route path="/bar-chart-ecarts" element={<EcartChart />} />
            <Route path="/bar-chart-frequency-previous-period" element={<FrequencyPreviousPeriodChart />} />
            <Route path="/bar-chart-recent-frequency" element={<RecentFrequencyChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
