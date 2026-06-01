export default function Badge({ children, tone = "default" }) {
  const map = {
    default: "bg-slate-700 text-slate-100",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    info: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[tone] || map.default}`}>{children}</span>;
}
