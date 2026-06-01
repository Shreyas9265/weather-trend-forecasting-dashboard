import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }) {
  return (
    <div className="card border-red-500/40 bg-red-500/10 text-red-200 flex gap-3 items-start">
      <AlertTriangle size={18} className="mt-0.5" />
      <div>
        <p className="font-semibold">Unable to load data</p>
        <p className="text-sm text-red-100/90">{message}</p>
      </div>
    </div>
  );
}
