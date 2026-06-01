import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import useFetch from "./components/useFetch";
import Overview from "./pages/Overview";
import Dataset from "./pages/Dataset";
import DataCleaning from "./pages/DataCleaning";
import EDA from "./pages/EDA";
import Forecasting from "./pages/Forecasting";
import AdvancedAnalysis from "./pages/AdvancedAnalysis";
import SpatialInsights from "./pages/SpatialInsights";
import PMMission from "./pages/PMMission";
import FinalInsights from "./pages/FinalInsights";

const pageMeta = {
  "/": ["Overview Dashboard", "Real-time insights and analytics from global weather data"],
  "/dataset": ["Dataset Intelligence", "Data inventory, schema, and quality profile"],
  "/data-cleaning": ["Data Cleaning", "Preprocessing, outlier treatment, and normalization"],
  "/eda": ["Exploratory Data Analysis", "Weather trends, correlation, and city comparison"],
  "/forecasting": ["Forecasting Lab", "Model evaluation and predictive insights"],
  "/advanced-analysis": ["Advanced Analysis", "Anomaly detection, AQI analysis, and feature impact"],
  "/spatial-insights": ["Spatial Insights", "Geo-weather intelligence and country summaries"],
  "/pm-mission": ["PM Accelerator Mission", "Mission alignment and assessment requirement"],
  "/final-insights": ["Final Insights", "Conclusions, value, and completion checklist"],
};

function Shell() {
  const location = useLocation();
  const [title, description] = pageMeta[location.pathname] || ["WeatherIQ", "Dashboard"];
  const { data: health } = useFetch("/api/health");
  const [city, setCity] = useState("Global");
  const [theme, setTheme] = useState("dark");
  const citySource = useFetch("/api/dataset-summary");

  const cityOptions = useMemo(() => citySource.data?.city_options || [], [citySource.data]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    if (city !== "Global" && cityOptions.length > 0 && !cityOptions.includes(city)) {
      setCity("Global");
    }
  }, [city, cityOptions]);

  const cityParam = city === "Global" ? "" : `?city=${encodeURIComponent(city)}`;

  return (
    <div className="min-h-screen px-4 py-4">
      <div className="max-w-[1700px] mx-auto lg:flex gap-4">
        <Sidebar />
        <main className="flex-1">
          <Header
            title={title}
            description={description}
            health={health}
            lastUpdated={health?.last_updated}
            city={city}
            cityOptions={cityOptions}
            onCityChange={setCity}
            theme={theme}
            onThemeChange={setTheme}
          />
          <Routes key={city}>
            <Route path="/" element={<Overview cityParam={cityParam} city={city} />} />
            <Route path="/dataset" element={<Dataset cityParam={cityParam} city={city} />} />
            <Route path="/data-cleaning" element={<DataCleaning cityParam={cityParam} city={city} />} />
            <Route path="/eda" element={<EDA cityParam={cityParam} city={city} />} />
            <Route path="/forecasting" element={<Forecasting cityParam={cityParam} city={city} />} />
            <Route path="/advanced-analysis" element={<AdvancedAnalysis cityParam={cityParam} city={city} />} />
            <Route path="/spatial-insights" element={<SpatialInsights cityParam={cityParam} city={city} />} />
            <Route path="/pm-mission" element={<PMMission />} />
            <Route path="/final-insights" element={<FinalInsights cityParam={cityParam} city={city} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
