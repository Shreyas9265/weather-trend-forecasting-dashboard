import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";

export default function Dataset({ cityParam = "" }) {
  const { data, loading, error } = useFetch(`/api/dataset-summary${cityParam}`);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const dtypeRows = Object.entries(data.dtypes).map(([column, dtype]) => ({ column, dtype }));

  return (
    <div>
      <SectionTitle title="Dataset" subtitle="Kaggle Global Weather Repository local dataset profile." />
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <MetricCard title="Source" value="Kaggle Global Weather Repository" />
        <MetricCard title="Shape" value={`${data.row_count.toLocaleString()} × ${data.column_count}`} />
        <MetricCard title="Columns" value={data.column_count} />
      </div>
      <div className="card mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge tone="info">Numeric: {data.column_types.numeric.length}</Badge>
          <Badge tone="warning">Categorical: {data.column_types.categorical.length}</Badge>
          <Badge tone="success">Datetime: {data.column_types.datetime.length}</Badge>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-white font-semibold mb-3">Sample Rows</h3>
          <DataTable columns={Object.keys(data.sample_rows[0] || {}).slice(0, 9)} rows={data.sample_rows.map(r => Object.fromEntries(Object.entries(r).slice(0,9)))} />
        </div>
        <div className="card">
          <h3 className="text-white font-semibold mb-3">Data Types</h3>
          <DataTable columns={["column", "dtype"]} rows={dtypeRows} />
        </div>
      </div>
    </div>
  );
}
