export default function LoadingSpinner({ label = "Loading insights..." }) {
  return (
    <div className="card flex items-center justify-center min-h-44">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-300 mt-3 text-sm">{label}</p>
      </div>
    </div>
  );
}
