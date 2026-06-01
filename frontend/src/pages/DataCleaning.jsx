import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";
import ChartCard from "../components/ChartCard";

export default function DataCleaning() {
  const { data, loading, error } = useFetch("/api/cleaning-summary");
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const miss = Object.keys(data.missing_values_before).slice(0, 12).map((k) => ({
    feature: k,
    before: data.missing_values_before[k],
    after: data.missing_values_after[k],
  }));

  const outliers = Object.keys(data.outlier_counts_by_column).slice(0, 12).map((k) => ({ feature: k, outliers: data.outlier_counts_by_column[k] }));

  return (
    <div>
      <SectionTitle title="Data Cleaning" subtitle="Missing values were handled, outliers were capped using IQR, and numeric features were normalized where required." />
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Rows Before" value={data.rows_before.toLocaleString()} />
        <MetricCard title="Rows After" value={data.rows_after.toLocaleString()} />
        <MetricCard title="Outlier Rows Affected" value={data.unique_outlier_rows_affected.toLocaleString()} />
        <MetricCard title="Normalized Features" value={data.numeric_columns.length} />
      </div>
      <div className="grid xl:grid-cols-2 gap-4">
        <ChartCard title="Missing Values Before vs After">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={miss}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="feature" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="before" fill="#0ea5e9" />
                <Bar dataKey="after" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Outlier Count by Feature">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={outliers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="feature" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="outliers" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <div className="card mt-4">
        <h3 className="text-white font-semibold">Cleaning Steps</h3>
        <ul className="mt-2 text-slate-300 text-sm space-y-1">
          {data.cleaning_steps.map((s) => <li key={s}>• {s}</li>)}
        </ul>
      </div>
    </div>
  );
}
