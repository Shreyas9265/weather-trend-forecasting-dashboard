import { useApi } from "../components/useApi";
import { ErrorView, Loading } from "../components/StateViews";

export default function Cleaning() {
  const { data, loading, error } = useApi("/api/cleaning-summary");
  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} />;

  return (
    <div className="space-y-4">
      <div className="card"><h2 className="text-2xl font-semibold">Data Cleaning</h2></div>
      <div className="card">
        <p><b>Rows before:</b> {data.rows_before}</p>
        <p><b>Rows after:</b> {data.rows_after}</p>
        <p><b>Normalization:</b> {data.normalization}</p>
        <p><b>Outlier rows affected:</b> {data.unique_outlier_rows_affected}</p>
      </div>
      <div className="card overflow-auto">
        <h3 className="font-semibold mb-2">Outlier Count by Column</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">Column</th><th>Outliers</th></tr></thead>
          <tbody>
            {Object.entries(data.outlier_counts_by_column).map(([k, v]) => (
              <tr key={k} className="border-b"><td className="py-2">{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
