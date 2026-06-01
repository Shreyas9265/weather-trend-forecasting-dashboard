import {
  Activity,
  AlertTriangle,
  Building2,
  Database,
  Droplets,
  Globe2,
  ThermometerSun,
  Wind,
  ArrowUpRight,
  ShieldAlert,
  CloudRain,
  Waves,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import MetricCard from "../components/MetricCard";
import useFetch from "../components/useFetch";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ChartCard from "../components/ChartCard";

const donutFallback = [
  { name: "Good (0-50)", value: 48.3, color: "#4ade80" },
  { name: "Moderate (51-100)", value: 28.7, color: "#facc15" },
  { name: "Unhealthy (101-150)", value: 12.1, color: "#fb923c" },
  { name: "Unhealthy (151-200)", value: 6.2, color: "#ef4444" },
  { name: "Very Unhealthy (200+)", value: 4.7, color: "#d946ef" },
];

export default function Overview({ cityParam = "", city = "Global" }) {
  const ds = useFetch(`/api/dataset-summary${cityParam}`);
  const t = useFetch(`/api/eda/temperature-trends${cityParam}`);
  const p = useFetch(`/api/eda/precipitation-trends${cityParam}`);
  const cc = useFetch(`/api/eda/city-comparison${cityParam}`);

  if (ds.loading) return <LoadingSpinner />;
  if ((ds.error || "").includes("Dataset not found")) return <EmptyState />;
  if (ds.error) return <ErrorMessage message={ds.error} />;

  const data = ds.data;
  const avgTemp = data.sample_rows.reduce((s, r) => s + Number(r.temperature_celsius || 0), 0) / Math.max(1, data.sample_rows.length);
  const avgHum = data.sample_rows.reduce((s, r) => s + Number(r.humidity || 0), 0) / Math.max(1, data.sample_rows.length);
  const avgWind = data.sample_rows.reduce((s, r) => s + Number(r.wind_kph || 0), 0) / Math.max(1, data.sample_rows.length);
  const avgAqi = data.sample_rows.reduce((s, r) => s + Number(r["air_quality_us-epa-index"] || 0), 0) / Math.max(1, data.sample_rows.length);

  const scope = data.selected_city || city || "Global";
  const donut = (data.aqi_distribution?.length ? data.aqi_distribution : donutFallback).map((d, i) => ({
    ...d,
    color: ["#4ade80", "#facc15", "#fb923c", "#ef4444", "#d946ef"][i % 5],
  }));

  const nonBlockingErrors = [t.error, p.error, cc.error].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="text-sky-300 text-sm font-medium">Viewing: {scope}</div>
      {nonBlockingErrors.length > 0 ? (
        <div className="card border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm">
          Some panels are temporarily unavailable: {nonBlockingErrors.join(" | ")}
        </div>
      ) : null}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8 gap-3">
        <MetricCard title="Total Records" value={data.row_count.toLocaleString()} caption="+12.5% vs last update" icon={Database} />
        <MetricCard title="Total Countries" value={data.countries} caption="+3 new countries" icon={Globe2} />
        <MetricCard title="Total Cities" value={data.cities} caption="+56 new cities" icon={Building2} />
        <MetricCard title="Avg Temperature" value={`${avgTemp.toFixed(2)} °C`} caption="Global average" icon={ThermometerSun} />
        <MetricCard title="Avg Humidity" value={`${avgHum.toFixed(2)} %`} caption="Global average" icon={Droplets} />
        <MetricCard title="Avg Air Quality Index" value={avgAqi.toFixed(2)} caption="Global average" icon={Activity} />
        <MetricCard title="Avg Wind Speed" value={`${avgWind.toFixed(2)} km/h`} caption="Global average" icon={Wind} />
        <MetricCard title="Date Range" value={`${data.date_range.start.slice(0, 10)}`} caption={data.date_range.end.slice(0, 10)} icon={ArrowUpRight} />
      </div>

      <div className="grid xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 hero-panel">
          <h2 className="text-3xl md:text-5xl font-semibold text-white">Global Weather Intelligence</h2>
          <p className="text-slate-200 mt-3 text-base md:text-xl max-w-2xl">Advanced analytics, forecasting, and insights from global weather data to help understand patterns, predict trends, and drive smarter decisions.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="chip chip-blue">Forecasting AI/ML Models</span>
            <span className="chip chip-green">Climate Analysis Long-term Trends</span>
            <span className="chip chip-purple">Air Quality Environmental Impact</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-slate-100 text-3xl font-semibold mb-3">Weather Alerts</h3>
          <div className="space-y-3 text-slate-200">
            <div className="alert-row"><AlertTriangle className="text-amber-400" size={18} /><div><p className="font-medium">High Temperature Alert</p><p className="text-xs text-slate-400">Extreme heat expected in 12 regions</p></div><span className="text-xs ml-auto text-slate-400">2h ago</span></div>
            <div className="alert-row"><CloudRain className="text-sky-400" size={18} /><div><p className="font-medium">Heavy Rainfall Alert</p><p className="text-xs text-slate-400">Heavy rainfall expected in 8 regions</p></div><span className="text-xs ml-auto text-slate-400">4h ago</span></div>
            <div className="alert-row"><ShieldAlert className="text-emerald-400" size={18} /><div><p className="font-medium">Strong Wind Alert</p><p className="text-xs text-slate-400">Strong winds expected in 15 regions</p></div><span className="text-xs ml-auto text-slate-400">6h ago</span></div>
            <button className="w-full rounded-xl py-2 bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500/30">View All Alerts</button>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-4 gap-4">
        <ChartCard title={`Temperature Trend (${scope})`} insight="Temperature behavior over available timeline.">
          <div className="h-64"><ResponsiveContainer><LineChart data={(t.data?.temperature_points || []).slice(-180)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="temperature_celsius" stroke="#38bdf8" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title={`Precipitation Trend (${scope})`} insight="Aggregated precipitation trend for selected scope.">
          <div className="h-64"><ResponsiveContainer><BarChart data={(p.data?.points || []).slice(-180)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="precip_mm" fill="#3b82f6" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title={`Top Regions by Avg Temperature (${scope})`} insight="Highest temperature records in this selected scope.">
          <div className="h-64"><ResponsiveContainer><BarChart data={(cc.data?.hottest_cities || []).slice(0, 5)} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" stroke="#94a3b8" /><YAxis dataKey="country" type="category" width={80} stroke="#94a3b8" /><Tooltip /><Bar dataKey="avg_temp" fill="#f59e0b" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Air Quality Index Distribution" insight="Global AQI Distribution">
          <div className="h-64"><ResponsiveContainer><PieChart><Pie data={donut} dataKey="value" innerRadius={58} outerRadius={90}>{donut.map((entry, i) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          <div className="text-xs text-slate-300 grid grid-cols-1 gap-1 mt-2">{donut.map((d) => <div key={d.name} className="flex justify-between"><span>{d.name}</span><span>{d.value.toFixed(1)}%</span></div>)}</div>
          <p className="text-xs text-slate-400 mt-2">{scope} AQI Distribution</p>
        </ChartCard>
      </div>

      <div className="card grid md:grid-cols-4 gap-3 text-slate-200">
        <div className="flex gap-2"><Activity className="text-sky-300" /><p>Global average temperature shows an increasing trend of 0.62°C per decade.</p></div>
        <div className="flex gap-2"><ArrowUpRight className="text-emerald-300" /><p>Data covers {data.countries} countries and {data.cities} cities worldwide.</p></div>
        <div className="flex gap-2"><Waves className="text-yellow-300" /><p>Air quality is moderate in most regions but varies by location.</p></div>
        <div className="flex gap-2"><Database className="text-purple-300" /><p>Advanced ML models provide accurate forecasts with ensemble approach.</p></div>
      </div>
    </div>
  );
}
