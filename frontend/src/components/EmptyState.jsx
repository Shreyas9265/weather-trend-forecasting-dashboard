import { Database } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="card text-center py-16">
      <Database className="mx-auto text-sky-300" size={34} />
      <h3 className="mt-4 text-xl font-semibold text-slate-100">Dataset not found</h3>
      <p className="text-slate-300 mt-2 max-w-xl mx-auto">
        Please download the Global Weather Repository CSV from Kaggle and place it in
        <span className="font-mono text-sky-300"> data/GlobalWeatherRepository.csv</span>.
      </p>
    </div>
  );
}
