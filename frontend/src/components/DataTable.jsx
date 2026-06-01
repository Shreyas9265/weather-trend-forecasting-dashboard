export default function DataTable({ columns, rows, maxH = "max-h-[360px]" }) {
  return (
    <div className={`overflow-auto ${maxH} rounded-xl border border-slate-700`}>
      <table className="w-full text-sm">
        <thead className="bg-slate-900 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-3 py-2 text-slate-300 font-medium whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-800">
              {columns.map((c) => (
                <td key={`${i}-${c}`} className="px-3 py-2 text-slate-100 whitespace-nowrap">{String(r[c] ?? "-")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
