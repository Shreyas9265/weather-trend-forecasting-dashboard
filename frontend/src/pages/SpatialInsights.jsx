import Plot from "react-plotly.js";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import SectionTitle from "../components/SectionTitle";
import useFetch from "../components/useFetch";

export default function SpatialInsights({ cityParam = "" }) {
  const { data, loading, error } = useFetch(`/api/advanced/spatial-summary${cityParam}`);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <SectionTitle title="Spatial Insights" subtitle="Country-level weather summaries and geo-distributed weather intelligence." />
      <ChartCard title="Global Weather Geo Map" insight="City points colored by average temperature.">
        <Plot
          data={[{
            type: "scattergeo",
            mode: "markers",
            lon: data.geo_points.map((p) => p.longitude),
            lat: data.geo_points.map((p) => p.latitude),
            text: data.geo_points.map((p) => `${p.location_name}, ${p.country}<br>Temp: ${p.avg_temp}°C`),
            marker: {
              size: 5,
              color: data.geo_points.map((p) => p.avg_temp),
              colorscale: "Turbo",
              colorbar: { title: "Temp °C" },
              opacity: 0.8,
            },
          }]}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, t: 0, b: 0 },
            paper_bgcolor: "#0b1220",
            geo: { bgcolor: "#0b1220", landcolor: "#1e293b", lakecolor: "#0f172a", countrycolor: "#334155" },
            font: { color: "#cbd5e1" },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%", height: 420 }}
        />
      </ChartCard>
      <div className="grid xl:grid-cols-2 gap-4 mt-4">
        <div className="card"><h3 className="text-white font-semibold mb-3">Country Weather Summary</h3><DataTable columns={["country", "avg_temp", "avg_precip", "avg_aqi", "cities"]} rows={data.country_summary} /></div>
        <div className="card"><h3 className="text-white font-semibold mb-3">Top Air Quality Risk Regions</h3><DataTable columns={["country", "location_name", "avg_aqi", "avg_temp"]} rows={data.top_air_quality_risk} /></div>
      </div>
    </div>
  );
}
