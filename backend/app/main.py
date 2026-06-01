from __future__ import annotations

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from .advanced_analysis import (
    air_quality_correlation,
    anomaly_detection,
    climate_analysis,
    consolidated_insights,
    feature_importance,
    spatial_summary,
)
from .data_loader import DATA_PATH, DatasetNotFoundError, load_dataset
from .eda import city_comparison, correlation_analysis, precipitation_trends, temperature_trends
from .forecasting import forecast_predictions, model_comparison
from .preprocessing import preprocess_dataset

app = FastAPI(title="WeatherIQ API", version="2.0.0", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cache = {
    "raw": None,
    "clean": None,
    "normalized": None,
    "cleaning_summary": None,
    "forecast_model_comparison": {},
    "forecast_predictions": {},
}


def _ensure_data_loaded():
    if _cache["raw"] is not None:
        return
    raw = load_dataset()
    clean, normalized, summary = preprocess_dataset(raw)
    _cache["raw"] = raw
    _cache["clean"] = clean
    _cache["normalized"] = normalized
    _cache["cleaning_summary"] = summary


def _guarded(handler):
    try:
        _ensure_data_loaded()
        return handler()
    except HTTPException:
        raise
    except DatasetNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def _filtered_df(city: str | None):
    df = _cache["clean"]
    if not isinstance(city, str) or not city.strip() or city.strip().lower() == "global":
        return df
    mask = df["location_name"].astype(str).str.lower() == city.strip().lower()
    city_df = df[mask]
    if city_df.empty:
        raise HTTPException(status_code=404, detail=f"No records found for city '{city}'.")
    return city_df


@app.get("/")
def root():
    return {
        "app": "WeatherIQ - Weather Intelligence Dashboard API",
        "status": "running",
        "dataset_path": str(DATA_PATH),
        "backend_ui": "/backend-ui",
        "docs": "/docs",
    }


@app.get("/api-docs", include_in_schema=False)
def custom_swagger_docs():
    html = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - API Docs",
        swagger_ui_parameters={
            "docExpansion": "none",
            "filter": True,
            "displayRequestDuration": True,
            "defaultModelsExpandDepth": 1,
        },
    ).body.decode("utf-8")

    css = """
    <style>
      body { background: radial-gradient(circle at 20% -10%, #173c6a, #071126 45%, #040914 100%) !important; }
      .swagger-ui .topbar { background: #030b1f !important; border-bottom: 1px solid #1e3a5f; }
      .swagger-ui .wrapper { max-width: 1500px; }
      .swagger-ui .info h2, .swagger-ui .info h1, .swagger-ui .info p, .swagger-ui { color: #e2e8f0 !important; }
      .swagger-ui .opblock-tag, .swagger-ui .opblock .opblock-summary-description { color: #dbeafe !important; }
      .swagger-ui .scheme-container { background: rgba(3,10,30,0.7) !important; border: 1px solid #1e3a5f; border-radius: 12px; box-shadow: none !important; }
      .swagger-ui .opblock { background: rgba(3,10,30,0.72) !important; border: 1px solid #1e3a5f !important; border-radius: 12px; }
      .swagger-ui .opblock.opblock-get { border-color: #16a34a !important; }
      .swagger-ui .opblock .opblock-summary { border-color: #1e3a5f !important; }
      .swagger-ui table thead tr td, .swagger-ui table thead tr th, .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #cbd5e1 !important; }
      .swagger-ui input[type=text], .swagger-ui textarea { background: #0b1730 !important; color: #e2e8f0 !important; border: 1px solid #334155 !important; }
      .swagger-ui .btn.execute { background: #0284c7 !important; border-color: #0284c7 !important; }
      .swagger-ui .btn.try-out__btn { border-color: #0ea5e9 !important; color: #7dd3fc !important; }
      .swagger-ui .responses-wrapper, .swagger-ui .opblock-body { background: rgba(2,8,23,0.35) !important; }
      .swagger-ui .info:after { content: "Architecture dashboard is now available at /docs"; display: block; margin-top: 8px; color: #7dd3fc; }
    </style>
    """
    return HTMLResponse(html.replace("</head>", f"{css}</head>"))


@app.get("/docs", include_in_schema=False)
def docs_dashboard_redirect():
    return RedirectResponse(url="/backend-ui", status_code=307)


@app.get("/backend-ui", response_class=HTMLResponse)
def backend_ui():
    endpoint_rows = [
        ("GET", "/", "Root endpoint"),
        ("GET", "/api/health", "Health check & dataset status"),
        ("GET", "/api/dataset-summary", "Dataset overview & summary"),
        ("GET", "/api/cleaning-summary", "Data cleaning summary"),
        ("GET", "/api/eda/temperature-trends", "Temperature trends over time"),
        ("GET", "/api/eda/precipitation-trends", "Precipitation trends over time"),
        ("GET", "/api/eda/correlation", "Correlation matrix"),
        ("GET", "/api/eda/city-comparison", "City/Country comparisons"),
        ("GET", "/api/forecasting/model-comparison", "Model metrics and leaderboard"),
        ("GET", "/api/forecasting/predictions", "Actual vs predicted + forecast"),
        ("GET", "/api/advanced/anomalies", "Anomaly detection results"),
        ("GET", "/api/advanced/air-quality", "Air quality analysis"),
        ("GET", "/api/advanced/feature-importance", "Feature importance scores"),
        ("GET", "/api/advanced/spatial-summary", "Spatial & geographic summary"),
        ("GET", "/api/insights", "Final insights & recommendations"),
    ]
    doc_hash = {
        "/": "#/default/root__get",
        "/api/health": "#/default/health_api_health_get",
        "/api/dataset-summary": "#/default/dataset_summary_api_dataset_summary_get",
        "/api/cleaning-summary": "#/default/cleaning_summary_api_cleaning_summary_get",
        "/api/eda/temperature-trends": "#/default/eda_temperature_trends_api_eda_temperature_trends_get",
        "/api/eda/precipitation-trends": "#/default/eda_precipitation_trends_api_eda_precipitation_trends_get",
        "/api/eda/correlation": "#/default/eda_correlation_api_eda_correlation_get",
        "/api/eda/city-comparison": "#/default/eda_city_comparison_api_eda_city_comparison_get",
        "/api/forecasting/model-comparison": "#/default/forecasting_model_comparison_api_forecasting_model_comparison_get",
        "/api/forecasting/predictions": "#/default/forecasting_predictions_api_forecasting_predictions_get",
        "/api/advanced/anomalies": "#/default/advanced_anomalies_api_advanced_anomalies_get",
        "/api/advanced/air-quality": "#/default/advanced_air_quality_api_advanced_air_quality_get",
        "/api/advanced/feature-importance": "#/default/advanced_feature_importance_api_advanced_feature_importance_get",
        "/api/advanced/spatial-summary": "#/default/advanced_spatial_summary_api_advanced_spatial_summary_get",
        "/api/insights": "#/default/insights_api_insights_get",
    }
    endpoint_html = "".join(
        f"<div class='ep-row'>"
        f"<a class='ep-main' href='/api-docs{doc_hash.get(p, '')}' target='_blank' rel='noopener noreferrer'>"
        f"<span class='method'>{m}</span><span class='path'>{p}</span><span class='desc'>{d}</span></a>"
        f"<a class='raw' href='{p}' target='_blank' rel='noopener noreferrer' title='Open raw JSON'>⤴</a>"
        f"</div>"
        for m, p, d in endpoint_rows
    )

    return f"""
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Weather Trend Forecasting – Backend (FastAPI)</title>
  <style>
    :root {{
      --bg1:#030712; --bg2:#071429; --line:#143553; --panel:#06142c; --text:#e2e8f0; --muted:#a8b3c7;
      --green:#22c55e; --cyan:#22d3ee; --blue:#60a5fa; --violet:#c084fc; --amber:#facc15; --rose:#fb7185;
    }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; color:var(--text); font-family:Inter,Segoe UI,sans-serif; background:radial-gradient(circle at 20% -15%, #173a64 0, #081529 40%, #030712 100%); }}
    .wrap {{ max-width:1820px; margin:0 auto; padding:22px; }}
    .title {{ text-align:center; margin-bottom:14px; }}
    .title h1 {{ margin:0; font-size:56px; font-weight:800; letter-spacing:.2px; }}
    .title p {{ margin:8px 0 0; color:#b3d7ff; font-size:32px; }}
    .grid {{ display:grid; grid-template-columns:380px 1fr 470px; gap:14px; align-items:start; }}
    .card {{ border:1px solid var(--line); background:rgba(4,17,37,.86); border-radius:18px; padding:16px; box-shadow:0 16px 30px rgba(0,0,0,.25); }}
    .h {{ color:#2dd4bf; font-size:36px; font-weight:800; margin:0 0 12px; }}
    .tree div {{ font-size:34px; margin:7px 0; color:#d7e4f7; }}
    .muted {{ color:var(--muted); }}
    .section-title {{ color:#22d3ee; text-align:center; font-size:38px; font-weight:800; margin:0 0 10px; }}
    .arch {{ border:1px solid var(--line); border-radius:14px; padding:14px; }}
    .arch-row {{ display:grid; grid-template-columns:1fr 52px 1.4fr 52px 1.2fr 52px 1.1fr; gap:10px; align-items:center; }}
    .node {{ border:2px solid #2a4f78; border-radius:14px; padding:14px; min-height:220px; background:rgba(2,10,24,.75); }}
    .node h3 {{ margin:0 0 8px; font-size:42px; }}
    .node p, .node li {{ font-size:30px; color:#d3deee; margin:7px 0; }}
    .node.fastapi {{ border-color:#22c55e; }} .node.service {{ border-color:#c084fc; }} .node.data {{ border-color:#facc15; }}
    .arrow {{ text-align:center; font-size:38px; color:#dbeafe; }}
    .pipeline {{ margin-top:12px; border:1px solid var(--line); border-radius:14px; padding:14px; }}
    .steps {{ display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }}
    .step {{ text-align:center; }}
    .dot {{ width:90px; height:90px; border-radius:50%; margin:0 auto 8px; border:2px solid #4f79a8; display:flex; align-items:center; justify-content:center; font-size:40px; }}
    .step h4 {{ margin:0; font-size:34px; }}
    .step p {{ margin:6px 0 0; font-size:27px; color:#c7d2e5; }}
    .features {{ margin-top:12px; border:1px solid var(--line); border-radius:14px; padding:12px; }}
    .feature-grid {{ display:grid; grid-template-columns:repeat(7,1fr); gap:10px; }}
    .feature {{ border:1px solid #2a4f78; border-radius:12px; padding:12px; text-align:center; min-height:120px; display:flex; flex-direction:column; justify-content:center; }}
    .feature b {{ font-size:30px; display:block; }}
    .errors {{ margin-top:12px; border:1px solid var(--line); border-radius:14px; padding:12px; }}
    .error-grid {{ display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }}
    .err {{ border:1px solid #2a4f78; border-radius:12px; padding:10px; min-height:90px; }}
    .err b {{ font-size:30px; }} .err p {{ margin:4px 0 0; font-size:24px; color:#c7d2e5; }}
    .ep-row {{ display:flex; align-items:center; gap:8px; border:1px solid #26486a; border-radius:10px; padding:8px; margin-bottom:7px; }}
    .ep-main {{ display:flex; align-items:center; gap:10px; text-decoration:none; flex:1; min-width:0; }}
    .ep-row:hover {{ border-color:#3b82f6; box-shadow:0 0 0 1px rgba(59,130,246,.5) inset; }}
    .raw {{ color:#7dd3fc; text-decoration:none; font-size:20px; border:1px solid #2b4f71; border-radius:8px; padding:2px 8px; }}
    .raw:hover {{ background:rgba(2,132,199,.2); }}
    .method {{ background:#16a34a; color:#fff; border-radius:7px; padding:4px 10px; font-size:22px; font-weight:700; }}
    .path {{ min-width:260px; font-family:ui-monospace,Menlo,monospace; font-size:24px; color:#ecfeff; }}
    .desc {{ font-size:22px; color:#b8c7db; }}
    .stack li {{ font-size:34px; margin:8px 0; }}
    .server p {{ font-size:30px; margin:8px 0; }}
    @media (max-width:1700px) {{ .title h1{{font-size:42px}} .title p{{font-size:24px}} .tree div,.node h3,.node p,.node li,.path,.desc,.stack li,.server p,.step h4,.step p,.feature b,.err b,.err p{{font-size:18px}} .h,.section-title{{font-size:24px}} .grid{{grid-template-columns:1fr}} .arch-row{{grid-template-columns:1fr}} .arrow{{display:none}} .steps{{grid-template-columns:repeat(2,1fr)}} .feature-grid{{grid-template-columns:repeat(3,1fr)}} .error-grid{{grid-template-columns:repeat(2,1fr)}} }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">
      <h1>Weather Trend Forecasting – Backend (FastAPI)</h1>
      <p>High-level architecture, modules, and API endpoints</p>
    </div>
    <div class="grid">
      <div>
        <div class="card">
          <h2 class="h">PROJECT STRUCTURE</h2>
          <div class="tree">
            <div>📁 backend/</div><div>&nbsp;&nbsp;📁 app/</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 main.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 data_loader.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 preprocessing.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 eda.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 forecasting.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 advanced_analysis.py</div><div>&nbsp;&nbsp;&nbsp;&nbsp;🐍 schemas.py</div><div>📄 requirements.txt</div><div>📄 README.md</div>
          </div>
        </div>
        <div class="card" style="margin-top:12px">
          <h2 class="h">TECH STACK</h2>
          <ul class="stack">
            <li>⚡ FastAPI</li><li>📊 Pandas</li><li>🔢 NumPy</li><li>🧠 Scikit-learn</li><li>🟢 Uvicorn</li><li>✅ Pydantic</li><li>⚙️ Joblib</li>
          </ul>
        </div>
      </div>
      <div>
        <div class="card">
          <h2 class="section-title">ARCHITECTURE OVERVIEW</h2>
          <div class="arch">
            <div class="arch-row">
              <div class="node"><h3 class="muted">Client</h3><p>Frontend (React)</p></div>
              <div class="arrow">➜</div>
              <div class="node fastapi"><h3 style="color:#22c55e">⚡ FastAPI</h3><ul><li>Routing</li><li>Validation (Pydantic)</li><li>Business Logic</li><li>JSON Response</li></ul></div>
              <div class="arrow">➜</div>
              <div class="node service"><h3 style="color:#c084fc">⚙️ Service Layer</h3><p>Data Loader</p><p>Preprocessing</p><p>EDA</p><p>Forecasting</p><p>Advanced Analysis</p><p>Insights</p></div>
              <div class="arrow">➜</div>
              <div class="node data"><h3 style="color:#facc15">🗃️ Data Layer</h3><p>GlobalWeatherRepository.csv</p><p>(Local CSV)</p></div>
            </div>
          </div>
          <div class="pipeline">
            <h2 class="section-title">DATA & ML PIPELINE</h2>
            <div class="steps">
              <div class="step"><div class="dot">📄</div><h4>1. Load Data</h4><p>Load CSV and parse dates</p></div>
              <div class="step"><div class="dot">🧹</div><h4>2. Preprocess</h4><p>Handle missing values, outliers</p></div>
              <div class="step"><div class="dot">📊</div><h4>3. EDA</h4><p>Statistics, trends, correlations</p></div>
              <div class="step"><div class="dot">🧠</div><h4>4. Modeling</h4><p>Train and evaluate models</p></div>
              <div class="step"><div class="dot">📈</div><h4>5. Insights</h4><p>Recommendations and summaries</p></div>
            </div>
          </div>
          <div class="features">
            <h2 class="section-title">KEY FEATURES</h2>
            <div class="feature-grid">
              <div class="feature"><b>Data Validation & Cleaning</b></div>
              <div class="feature"><b>Exploratory Data Analysis</b></div>
              <div class="feature"><b>Multiple Forecasting Models</b></div>
              <div class="feature"><b>Anomaly Detection</b></div>
              <div class="feature"><b>Air Quality Analysis</b></div>
              <div class="feature"><b>Spatial & Geographic Insights</b></div>
              <div class="feature"><b>Actionable Insights</b></div>
            </div>
          </div>
          <div class="errors">
            <h2 class="section-title">ERROR HANDLING</h2>
            <div class="error-grid">
              <div class="err"><b>Dataset Missing</b><p>Clear CSV guidance</p></div>
              <div class="err"><b>Invalid Request</b><p>400 with details</p></div>
              <div class="err"><b>Server Error</b><p>500 fallback handling</p></div>
              <div class="err"><b>Validation Error</b><p>Pydantic validation</p></div>
              <div class="err"><b>Not Found</b><p>404 endpoint handling</p></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <h2 class="h">API ENDPOINTS</h2>
          <div class="ep-row"><span class="path">Base URL: http://127.0.0.1:8000</span></div>
          {endpoint_html}
        </div>
        <div class="card server" style="margin-top:12px">
          <h2 class="h">SERVER INFO</h2>
          <p>Framework: FastAPI</p><p>Server: Uvicorn</p><p>Port: 8000</p><p>Swagger Docs: <a href="/api-docs" target="_blank" style="color:#7dd3fc">/api-docs</a></p><p>Architecture UI: <a href="/docs" style="color:#7dd3fc">/docs</a></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""


@app.get("/api/health")
def health():
    try:
        _ensure_data_loaded()
        loaded = True
        last_updated = _cache["raw"]["last_updated"].max().strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        loaded = False
        last_updated = None
    return {"status": "ok", "dataset_loaded": loaded, "last_updated": last_updated}


@app.get("/api/dataset-summary")
def dataset_summary(city: str | None = Query(default=None)):
    def _resp():
        raw = _cache["raw"]
        base = _filtered_df(city)
        numeric_cols = raw.select_dtypes(include=[np.number]).columns.tolist()
        datetime_cols = [c for c in raw.columns if "date" in c.lower() or "time" in c.lower() or c == "last_updated"]
        categorical_cols = [c for c in raw.columns if c not in numeric_cols and c not in datetime_cols]
        city_options = sorted(raw["location_name"].dropna().astype(str).unique().tolist())

        aqi_distribution = []
        if "air_quality_us-epa-index" in base.columns:
            epa = base["air_quality_us-epa-index"]
            epa = epa.replace([np.inf, -np.inf], np.nan).dropna()
            total = float(len(epa)) if len(epa) else 1.0
            buckets = [
                ("Good (0-50)", ((epa >= 1) & (epa <= 1)).sum()),
                ("Moderate (51-100)", ((epa >= 2) & (epa <= 2)).sum()),
                ("Unhealthy (101-150)", ((epa >= 3) & (epa <= 3)).sum()),
                ("Unhealthy (151-200)", ((epa >= 4) & (epa <= 4)).sum()),
                ("Very Unhealthy (200+)", ((epa >= 5)).sum()),
            ]
            aqi_distribution = [{"name": n, "value": float((c / total) * 100.0)} for n, c in buckets]

        return {
            "selected_city": city or "Global",
            "row_count": int(len(base)),
            "column_count": int(len(raw.columns)),
            "countries": int(base["country"].nunique()),
            "cities": int(base["location_name"].nunique()),
            "date_range": {
                "start": base["last_updated"].min().strftime("%Y-%m-%d %H:%M:%S"),
                "end": base["last_updated"].max().strftime("%Y-%m-%d %H:%M:%S"),
            },
            "missing_values": base.isna().sum().to_dict(),
            "column_types": {
                "numeric": numeric_cols,
                "categorical": categorical_cols,
                "datetime": datetime_cols,
            },
            "dtypes": {c: str(t) for c, t in raw.dtypes.items()},
            "sample_rows": base.head(10).replace({np.nan: None}).to_dict(orient="records"),
            "city_options": city_options,
            "aqi_distribution": aqi_distribution,
        }

    return _guarded(_resp)


@app.get("/api/cleaning-summary")
def cleaning_summary():
    return _guarded(
        lambda: {
            **_cache["cleaning_summary"],
            "cleaning_steps": [
                "Parsed and validated last_updated timestamps for time-series readiness.",
                "Handled missing values: numeric by median, categorical by mode.",
                "Handled outliers using IQR clipping to reduce extreme distortion.",
                "Normalized numeric features with StandardScaler for model stability.",
            ],
        }
    )


@app.get("/api/eda/temperature-trends")
def eda_temperature_trends(city: str | None = Query(default=None)):
    return _guarded(lambda: temperature_trends(_filtered_df(city)))


@app.get("/api/eda/precipitation-trends")
def eda_precipitation_trends(city: str | None = Query(default=None)):
    return _guarded(lambda: precipitation_trends(_filtered_df(city)))


@app.get("/api/eda/correlation")
def eda_correlation(city: str | None = Query(default=None)):
    return _guarded(lambda: correlation_analysis(_filtered_df(city)))


@app.get("/api/eda/city-comparison")
def eda_city_comparison(city: str | None = Query(default=None)):
    return _guarded(lambda: city_comparison(_filtered_df(city)))


@app.get("/api/forecasting/model-comparison")
def forecasting_model_comparison(city: str | None = Query(default=None)):
    def _resp():
        key = (city or "Global").lower()
        if key not in _cache["forecast_model_comparison"]:
            try:
                result = model_comparison(_filtered_df(city))
                result["forecast_scope"] = city or "Global"
                _cache["forecast_model_comparison"][key] = result
            except ValueError:
                # If a city slice is too small, fallback to global so forecasting page still works.
                result = model_comparison(_filtered_df("Global"))
                result["forecast_scope"] = "Global (fallback)"
                result["warning"] = "Selected city has insufficient cleaned rows; using global forecasting model."
                _cache["forecast_model_comparison"][key] = result
        return _cache["forecast_model_comparison"][key]

    return _guarded(_resp)


@app.get("/api/forecasting/predictions")
def forecasting_predictions(city: str | None = Query(default=None)):
    def _resp():
        key = (city or "Global").lower()
        if key not in _cache["forecast_predictions"]:
            try:
                result = forecast_predictions(_filtered_df(city))
                result["forecast_scope"] = city or "Global"
                _cache["forecast_predictions"][key] = result
            except ValueError:
                result = forecast_predictions(_filtered_df("Global"))
                result["forecast_scope"] = "Global (fallback)"
                result["warning"] = "Selected city has insufficient cleaned rows; using global forecasting predictions."
                _cache["forecast_predictions"][key] = result
        return _cache["forecast_predictions"][key]

    return _guarded(_resp)


@app.get("/api/advanced/anomalies")
def advanced_anomalies(city: str | None = Query(default=None)):
    return _guarded(lambda: anomaly_detection(_filtered_df(city)))


@app.get("/api/advanced/air-quality")
def advanced_air_quality(city: str | None = Query(default=None)):
    def _resp():
        try:
            return air_quality_correlation(_filtered_df(city))
        except HTTPException:
            raise
        except Exception as exc:
            # Failsafe: keep dashboard functional for edge-case city slices.
            return {
                "aqi_metric": None,
                "correlations": [],
                "aqi_trend": [],
                "aqi_by_country": [],
                "temperature_vs_aqi": [],
                "humidity_vs_aqi": [],
                "aqi_distribution": [],
                "warning": f"air_quality_fallback: {str(exc)}",
            }

    return _guarded(_resp)


@app.get("/api/advanced/feature-importance")
def advanced_feature_importance(city: str | None = Query(default=None)):
    return _guarded(lambda: feature_importance(_filtered_df(city)))


@app.get("/api/advanced/spatial-summary")
def advanced_spatial_summary(city: str | None = Query(default=None)):
    return _guarded(lambda: spatial_summary(_filtered_df(city)))


@app.get("/api/advanced/climate-patterns")
def advanced_climate_patterns(city: str | None = Query(default=None)):
    return _guarded(lambda: climate_analysis(_filtered_df(city)))


@app.get("/api/insights")
def insights(city: str | None = Query(default=None)):
    return _guarded(lambda: consolidated_insights(_filtered_df(city)))
