import Badge from "./Badge";

export default function ModelMetricCard({ label, value, best }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <p className="text-slate-300 text-sm">{label}</p>
        {best ? <Badge tone="success">Best</Badge> : null}
      </div>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
