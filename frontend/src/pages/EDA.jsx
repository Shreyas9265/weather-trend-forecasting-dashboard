import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";

export default function EDA({ cityParam = "" }) {
  const t = useFetch(`/api/eda/temperature-trends${cityParam}`);
  const p = useFetch(`/api/eda/precipitation-trends${cityParam}`);
  const c = useFetch(`/api/eda/city-comparison${cityParam}`);
  if (t.loading || p.loading || c.loading) return <LoadingSpinner />;
  if (t.error || p.error || c.error) return <ErrorMessage message={t.error || p.error || c.error} />;

  return (
    <div>
      <SectionTitle title="EDA" subtitle="Trends, correlations, and city/country comparisons from global weather observations." />
      <div className="grid xl:grid-cols-2 gap-4">
        <ChartCard title="Temperature Trend Over Time" insight="Rolling average smooths daily volatility.">
          <div className="h-72"><ResponsiveContainer><LineChart data={t.data.temperature_points.slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="temperature_celsius" stroke="#38bdf8" dot={false} /><Line dataKey="rolling_7d" stroke="#22c55e" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Precipitation Trend" insight="Aggregated by day using precipitation sum.">
          <div className="h-72"><ResponsiveContainer><BarChart data={p.data.points.slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="precip_mm" fill="#0ea5e9" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Humidity Trend" insight="Global humidity stability and fluctuation pattern.">
          <div className="h-72"><ResponsiveContainer><LineChart data={t.data.humidity_points.slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="humidity" stroke="#a78bfa" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Wind Speed Trend" insight="Average wind intensity over time.">
          <div className="h-72"><ResponsiveContainer><LineChart data={t.data.wind_points.slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="wind_kph" stroke="#f59e0b" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Top 10 Hottest Cities" insight="Average temperature by city.">
          <div className="h-72"><ResponsiveContainer><BarChart data={c.data.hottest_cities}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="location_name" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="avg_temp" fill="#ef4444" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Top 10 Coldest Cities" insight="Lower average temperature cluster.">
          <div className="h-72"><ResponsiveContainer><BarChart data={c.data.coldest_cities}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="location_name" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="avg_temp" fill="#22c55e" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
    </div>
  );
}
