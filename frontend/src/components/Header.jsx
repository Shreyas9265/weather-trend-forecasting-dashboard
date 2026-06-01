import { MoonStar, SunMedium } from "lucide-react";
import Badge from "./Badge";

export default function Header({
  title,
  description,
  health,
  lastUpdated,
  city,
  cityOptions = [],
  onCityChange,
  theme,
  onThemeChange,
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-slate-300 text-sm md:text-lg mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="info">Last Updated: {lastUpdated || "-"}</Badge>
        <Badge tone={health?.dataset_loaded ? "success" : "danger"}>
          {health?.dataset_loaded ? "Dataset Loaded" : "Dataset Missing"}
        </Badge>
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2">
          <label className="text-xs text-slate-300">Select City</label>
          <select value={city} onChange={(e) => onCityChange?.(e.target.value)} className="bg-transparent text-slate-100 text-sm outline-none min-w-[130px]">
            <option value="Global">Global</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => onThemeChange?.("light")} className={`w-10 h-10 rounded-xl border text-slate-300 flex items-center justify-center ${theme === "light" ? "bg-sky-500/25 border-sky-300/60" : "bg-slate-900/80 border-slate-700"}`}>
          <SunMedium size={16} />
        </button>
        <button onClick={() => onThemeChange?.("dark")} className={`w-10 h-10 rounded-xl border text-slate-300 flex items-center justify-center ${theme === "dark" ? "bg-sky-500/25 border-sky-300/60" : "bg-slate-900/80 border-slate-700"}`}>
          <MoonStar size={16} />
        </button>
      </div>
    </header>
  );
}
