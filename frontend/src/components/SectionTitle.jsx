export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
      {subtitle ? <p className="text-slate-300 mt-1 text-sm">{subtitle}</p> : null}
    </div>
  );
}
