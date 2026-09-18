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
import Export from "./pages/Export.tsx";
import DashboardStars from "./pages/Dashboard/DashboardStars.tsx";
import DataNumbers from "./pages/DataNumbers.tsx";
import DataStars from "./pages/DataStars.tsx";
import EuroAnimation from "./pages/EuroAnimation.tsx";
import ChartPage from "./components/charts/ChartPage.tsx";
import { CHARTS } from "./components/charts/chartConfigs.ts";

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

            {/* Charts Numbers + Stars */}
            {CHARTS.map((chart) => (
              <Route key={chart.id} path={chart.path} element={<ChartPage config={chart} />} />
            ))}

            <Route path="/data-numbers" element={<DataNumbers />} />
            <Route path="/data-stars" element={<DataStars />} />

            <Route path="/dollar" element={<EuroAnimation />} />
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
