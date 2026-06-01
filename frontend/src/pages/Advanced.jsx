import { useApi } from "../components/useApi";
import { ErrorView, Loading } from "../components/StateViews";

export default function Advanced() {
  const a = useApi("/api/advanced/anomalies");
  const q = useApi("/api/advanced/air-quality");
  const f = useApi("/api/advanced/feature-importance");
  const s = useApi("/api/advanced/spatial-summary");

  if (a.loading || q.loading || f.loading || s.loading) return <Loading />;
  if (a.error) return <ErrorView message={a.error} />;
  if (q.error) return <ErrorView message={q.error} />;
  if (f.error) return <ErrorView message={f.error} />;
  if (s.error) return <ErrorView message={s.error} />;

  return (
    <div className="space-y-4">
      <div className="card"><h2 className="text-2xl font-semibold">Advanced Analysis</h2></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold">Anomaly Detection</h3>
          <p className="text-sm mt-2">Rows analyzed: {a.data.total_rows}</p>
          <p className="text-sm">Anomalies detected: {a.data.anomaly_rows}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Spatial Summary</h3>
          <p className="text-sm mt-2">Total locations: {s.data.total_locations}</p>
          <p className="text-sm">Hottest sample: {s.data.top_hottest_locations[0]?.location_name}</p>
        </div>
      </div>
      <div className="card overflow-auto">
        <h3 className="font-semibold mb-2">Top Feature Importance</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">Feature</th><th>Importance</th></tr></thead>
          <tbody>
            {f.data.feature_importance.slice(0, 10).map((r) => (
              <tr key={r.feature} className="border-b"><td className="py-2">{r.feature}</td><td>{r.importance.toFixed(4)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card overflow-auto">
        <h3 className="font-semibold mb-2">Air Quality Correlations</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">Metric</th><th>Temp</th><th>Humidity</th><th>Precip</th></tr></thead>
          <tbody>
            {q.data.correlations.map((r) => (
              <tr key={r.air_quality_metric} className="border-b">
                <td className="py-2">{r.air_quality_metric}</td>
                <td>{(r.temperature_celsius || 0).toFixed(3)}</td>
                <td>{(r.humidity || 0).toFixed(3)}</td>
                <td>{(r.precip_mm || 0).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
