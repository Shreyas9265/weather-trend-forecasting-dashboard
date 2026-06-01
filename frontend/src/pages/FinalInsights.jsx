import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";

export default function FinalInsights({ cityParam = "" }) {
  const { data, loading, error } = useFetch(`/api/insights${cityParam}`);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const checklistRows = Object.entries(data.assessment_checklist).map(([k, v]) => ({ item: k.replaceAll("_", " "), status: v ? "Completed" : "Pending" }));

  return (
    <div>
      <SectionTitle title="Final Insights" subtitle="Project conclusions, data science value, and completion checklist." />
      <div className="card mb-4">
        <h3 className="text-white font-semibold mb-2">Key Weather Trends</h3>
        <ul className="text-slate-300 text-sm space-y-1">{data.key_weather_trends.map((x) => <li key={x}>• {x}</li>)}</ul>
      </div>
      <div className="grid xl:grid-cols-2 gap-4 mb-4">
        <div className="card"><h3 className="text-white font-semibold mb-2">Forecasting Results</h3><p className="text-slate-300 text-sm">{data.forecasting_results}</p></div>
        <div className="card"><h3 className="text-white font-semibold mb-2">Environmental Impact Insights</h3><p className="text-slate-300 text-sm">{data.environmental_impact_insights}</p></div>
        <div className="card"><h3 className="text-white font-semibold mb-2">Geographic Insights</h3><p className="text-slate-300 text-sm">{data.geographic_insights}</p></div>
        <div className="card"><h3 className="text-white font-semibold mb-2">Business/Data Science Value</h3><p className="text-slate-300 text-sm">{data.business_value}</p></div>
      </div>
      <div className="card mb-4">
        <h3 className="text-white font-semibold mb-2">Recommendations</h3>
        <ul className="text-slate-300 text-sm space-y-1">{data.recommendations.map((x) => <li key={x}>• {x}</li>)}</ul>
      </div>
      <div className="card">
        <h3 className="text-white font-semibold mb-2">Project Completion Checklist</h3>
        <DataTable columns={["item", "status"]} rows={checklistRows} />
      </div>
    </div>
  );
}
