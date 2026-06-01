export default function ChartCard({ title, insight, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <h3 className="text-slate-100 font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
      {insight ? <p className="text-xs text-slate-400 mt-3">{insight}</p> : null}
    </div>
  );
}
