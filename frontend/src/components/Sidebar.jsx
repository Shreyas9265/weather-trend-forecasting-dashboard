import {
  BarChart3,
  Brain,
  Database,
  Home,
  LineChart,
  MapPin,
  Sparkles,
  Telescope,
  Wrench,
  ChevronDown,
  CloudRain,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  ["/", "Overview", Home],
  ["/dataset", "Dataset", Database],
  ["/data-cleaning", "Data Cleaning", Wrench],
  ["/eda", "EDA", BarChart3],
  ["/forecasting", "Forecasting", LineChart],
  ["/advanced-analysis", "Advanced Analysis", Brain],
  ["/spatial-insights", "Spatial Insights", MapPin],
  ["/final-insights", "Final Insights", Telescope],
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-72 side-panel lg:min-h-[calc(100vh-2rem)] lg:sticky lg:top-4">
      <div className="mb-5 px-1">
        <h2 className="text-[2rem] leading-none font-bold text-white flex items-center gap-2">
          <CloudRain size={30} className="text-sky-300" />
          WeatherIQ
        </h2>
        <p className="text-slate-300 text-sm">Global Weather Forecasting</p>
      </div>
      <nav className="space-y-1.5">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition ${isActive ? "bg-slate-100/15 text-white border border-slate-300/20" : "text-slate-300 hover:bg-slate-100/8"}`
            }
          >
            <span className="flex items-center gap-2.5">
              <Icon size={17} /> {label}
            </span>
            {(label === "EDA" || label === "Advanced Analysis") && <ChevronDown size={14} className="opacity-80" />}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 p-4 rounded-2xl border border-slate-500/20 bg-slate-900/60">
        <Sparkles className="text-sky-300" size={26} />
        <p className="text-xl text-slate-100 font-semibold mt-2">Weather changes Everything!</p>
        <p className="text-slate-300 text-sm mt-1">Data-driven insights for a better tomorrow.</p>
      </div>
    </aside>
  );
}
