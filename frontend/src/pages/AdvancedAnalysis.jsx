import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";

export default function AdvancedAnalysis({ cityParam = "" }) {
  const an = useFetch(`/api/advanced/anomalies${cityParam}`);
  const aq = useFetch(`/api/advanced/air-quality${cityParam}`);
  const fi = useFetch(`/api/advanced/feature-importance${cityParam}`);
  const cp = useFetch(`/api/advanced/climate-patterns${cityParam}`);
  if (an.loading || fi.loading || cp.loading) return <LoadingSpinner />;
  if (an.error || fi.error || cp.error) return <ErrorMessage message={an.error || fi.error || cp.error} />;

  const aqFailed = !!aq.error;
  const aqData = aq.data || {
    aqi_metric: "Unavailable",
    aqi_trend: [],
    temperature_vs_aqi: [],
  };

  return (
    <div>
      <SectionTitle title="Advanced Analysis" subtitle="Anomalies, air quality intelligence, feature influence, and climate patterns." />
      {aqFailed ? (
        <div className="card border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm mb-4">
          Air Quality submodule returned an error for this city. Other advanced analytics remain active.
          <br />
          {aq.error}
        </div>
      ) : null}
      <div className="grid xl:grid-cols-2 gap-4">
        <ChartCard title="Anomaly Trend" insight={`Detected anomalies: ${an.data.anomaly_rows} (${an.data.anomaly_rate.toFixed(2)}%)`}>
          <div className="h-72"><ResponsiveContainer><LineChart data={an.data.anomaly_trend.slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="anomaly_count" stroke="#f59e0b" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Feature Importance" insight="Top drivers influencing temperature prediction.">
          <div className="h-72"><ResponsiveContainer><BarChart layout="vertical" data={fi.data.feature_importance.slice(0,10)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" stroke="#94a3b8" /><YAxis type="category" dataKey="feature" width={110} stroke="#94a3b8" /><Tooltip /><Bar dataKey="importance" fill="#38bdf8" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="AQI Trend" insight={`Using metric: ${aqData.aqi_metric}`}>
          <div className="h-72"><ResponsiveContainer><LineChart data={(aqData.aqi_trend || []).slice(-200)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="avg_aqi" stroke="#ef4444" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Temperature vs AQI" insight="Scatter relationship between thermal condition and air quality.">
          <div className="h-72"><ResponsiveContainer><ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis type="number" dataKey="temperature_celsius" stroke="#94a3b8" /><YAxis type="number" dataKey="aqi" stroke="#94a3b8" /><Tooltip /><Scatter data={aqData.temperature_vs_aqi || []} fill="#22c55e" /></ScatterChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
      <div className="card mt-4">
        <h3 className="text-white font-semibold mb-3">Top Anomalous Records</h3>
        <DataTable columns={["country", "location_name", "last_updated", "temperature_celsius", "humidity", "precip_mm"]} rows={an.data.sample} />
      </div>
    </div>
  );
}
