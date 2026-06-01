import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import ModelMetricCard from "../components/ModelMetricCard";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";
import DataTable from "../components/DataTable";

export default function Forecasting({ cityParam = "" }) {
  const m = useFetch(`/api/forecasting/model-comparison${cityParam}`);
  const p = useFetch(`/api/forecasting/predictions${cityParam}`);
  if (m.loading || p.loading) return <LoadingSpinner />;
  if (m.error || p.error) return <ErrorMessage message={m.error || p.error} />;

  return (
    <div>
      <SectionTitle title="Forecasting" subtitle="Model comparison and future weather trend projection." />
      {(m.data.warning || p.data.warning) ? (
        <div className="card border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm mb-4">
          {m.data.warning || p.data.warning}
        </div>
      ) : null}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <ModelMetricCard label="MAE" value={p.data.metrics.MAE.toFixed(3)} best />
        <ModelMetricCard label="RMSE" value={p.data.metrics.RMSE.toFixed(3)} best />
        <ModelMetricCard label="MAPE" value={`${p.data.metrics.MAPE.toFixed(2)}%`} best />
        <ModelMetricCard label="R²" value={p.data.metrics.R2.toFixed(3)} best />
      </div>
      <div className="card mb-4">
        <h3 className="text-white font-semibold mb-2">Model Leaderboard</h3>
        <p className="text-xs text-slate-400 mb-2">Scope: {m.data.forecast_scope || p.data.forecast_scope || "Global"}</p>
        <DataTable columns={["model", "MAE", "RMSE", "MAPE", "R2"]} rows={m.data.leaderboard.map(r => ({...r, MAE:r.MAE.toFixed(3), RMSE:r.RMSE.toFixed(3), MAPE:r.MAPE.toFixed(2), R2:r.R2.toFixed(3)}))} />
      </div>
      <div className="grid xl:grid-cols-2 gap-4">
        <ChartCard title="Actual vs Predicted" insight={p.data.explanation}>
          <div className="h-72"><ResponsiveContainer><LineChart data={p.data.historical_predictions.slice(-180)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" hide /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="actual_temperature_celsius" stroke="#e2e8f0" dot={false} /><Line dataKey="predicted_temperature_celsius" stroke="#38bdf8" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Future Forecast" insight={`Best model: ${m.data.best_model}`}>
          <div className="h-72"><ResponsiveContainer><LineChart data={p.data.future_forecast}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="predicted_temperature_celsius" stroke="#22c55e" dot={false} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
    </div>
  );
}
