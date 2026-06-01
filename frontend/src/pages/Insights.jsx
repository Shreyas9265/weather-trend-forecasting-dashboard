import { useApi } from "../components/useApi";
import { ErrorView, Loading } from "../components/StateViews";

export default function Insights() {
  const { data, loading, error } = useApi("/api/insights");
  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} />;

  return (
    <div className="space-y-4">
      <div className="card"><h2 className="text-2xl font-semibold">Insights</h2></div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><p className="text-sm text-slate-500">Min Temp</p><p className="text-2xl font-bold">{data.temperature_overview.min_c.toFixed(2)}°C</p></div>
        <div className="card"><p className="text-sm text-slate-500">Avg Temp</p><p className="text-2xl font-bold">{data.temperature_overview.avg_c.toFixed(2)}°C</p></div>
        <div className="card"><p className="text-sm text-slate-500">Max Temp</p><p className="text-2xl font-bold">{data.temperature_overview.max_c.toFixed(2)}°C</p></div>
      </div>
      <div className="card">
        <h3 className="font-semibold">Wettest Average Location</h3>
        <p className="mt-2 text-sm">{data.wettest_avg_location?.location_name} ({data.wettest_avg_location?.precip_mm?.toFixed(2)} mm)</p>
      </div>
    </div>
  );
}
