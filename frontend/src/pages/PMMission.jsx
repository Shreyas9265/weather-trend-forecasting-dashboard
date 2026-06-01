import SectionTitle from "../components/SectionTitle";

export default function PMMission() {
  return (
    <div>
      <SectionTitle title="PM Accelerator Mission" subtitle="Mission alignment and product-thinking rationale." />
      <div className="card space-y-4 text-slate-200 leading-7">
        <p><span className="font-semibold text-white">Mission Statement:</span> PM Accelerator empowers innovators to build impactful AI-first products that solve real-world problems.</p>
        <p><span className="font-semibold text-white">Project Alignment:</span> WeatherIQ translates complex weather and environmental data into actionable intelligence using forecasting, anomaly detection, and spatial analytics.</p>
        <p><span className="font-semibold text-white">Decision Support:</span> The dashboard supports data-driven planning by highlighting trend risks, forecast confidence, and regional climate behavior across countries and cities.</p>
        <p><span className="font-semibold text-white">Demonstrated Capabilities:</span> End-to-end data science workflow, analytics storytelling, API productization, and professional user experience design.</p>
      </div>
    </div>
  );
}
