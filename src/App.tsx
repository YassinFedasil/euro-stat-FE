import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Statistics from "./pages/Statistics.tsx";
import Numbers from "./pages/Numbers.tsx";
import Stars from "./pages/Stars.tsx";
import ReportChart from "./pages/Charts/Numbers/ReportChart.tsx";
import OutChart from "./pages/Charts/Numbers/OutChart.tsx";
import ProgressionChart from "./pages/Charts/Numbers/ProgressionChart.tsx";
import DelayChart from "./pages/Charts/Numbers/DelayChart.tsx";
import EcartChart from "./pages/Charts/Numbers/EcartChart.tsx";
import FrequencyChart from "./pages/Charts/Numbers/FrequencyChart.tsx";
import FrequencyPreviousPeriodChart from "./pages/Charts/Numbers/FrequencyPreviousPeriodChart.tsx";
import RecentFrequencyChart from "./pages/Charts/Numbers/RecentFrequencyChart.tsx";
import Export from "./pages/Export.tsx";
import DelayStarChart from "./pages/Charts/Stars/DelayStarChart.tsx";
import ProgressionStarChart from "./pages/Charts/Stars/ProgressionStarChart.tsx";
import FrequencyStarChart from "./pages/Charts/Stars/FrequencyStarChart.tsx";
import FrequencyPreviousPeriodStarChart from "./pages/Charts/Stars/FrequencyPreviousPeriodStarChart.tsx";
import RecentFrequencyStarChart from "./pages/Charts/Stars/RecentFrequencyStarChart.tsx";
import DashboardStars from "./pages/Dashboard/DashboardStars.tsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route index path="/dashboard-stars" element={<DashboardStars />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/numbers" element={<Numbers />} />
            <Route path="/stars" element={<Stars />} />
            <Route path="/export" element={<Export />} />

            <Route path="/blank" element={<Blank />} />

            {/* Charts Numbers*/}
            <Route path="/bar-chart-report" element={<ReportChart />} />
            <Route path="/bar-chart-out" element={<OutChart />} />
            <Route path="/bar-chart-delay" element={<DelayChart />} />
            <Route path="/bar-chart-progression" element={<ProgressionChart />} />
            <Route path="/bar-chart-frequency" element={<FrequencyChart />} />
            <Route path="/bar-chart-ecarts" element={<EcartChart />} />
            <Route path="/bar-chart-frequency-previous-period" element={<FrequencyPreviousPeriodChart />} />
            <Route path="/bar-chart-recent-frequency" element={<RecentFrequencyChart />} />

            {/* Charts Stars*/}
            <Route path="/bar-chart-star-delay" element={<DelayStarChart />} />
            <Route path="/bar-chart-star-progression" element={<ProgressionStarChart />} />
            <Route path="/bar-chart-star-frequency" element={<FrequencyStarChart />} />
            <Route path="/bar-chart-star-frequency-previous-period" element={<FrequencyPreviousPeriodStarChart />} />
            <Route path="/bar-chart-star-recent-frequency" element={<RecentFrequencyStarChart />} />
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
