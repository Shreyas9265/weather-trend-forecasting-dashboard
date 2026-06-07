# WeatherIQ - Weather Intelligence Dashboard

A premium full-stack Weather Trend Forecasting platform built for the PM Accelerator assessment.

## Objective
Build a professional analytics product that performs end-to-end weather data science:
- cleaning and preprocessing
- EDA and trend analysis
- forecasting and evaluation
- anomaly and climate intelligence
- spatial/global weather insights

## Dataset Source
Kaggle Global Weather Repository: https://www.kaggle.com/datasets/nelgiriyewithana/global-weather-repository/code

Required local file:
`data/GlobalWeatherRepository.csv`

If missing, the backend returns a clear error and frontend shows an empty state prompt.

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, Recharts, Plotly, Axios, Lucide React, Framer Motion
- Backend: FastAPI, pandas, numpy, scikit-learn, uvicorn

## Features
- Premium SaaS-style dashboard (dark navy + sky blue)
- Fixed sidebar + responsive layout
- Dataset profiling page with schema/missing/sample rows
- Data cleaning summary with before/after and outlier charts
- EDA charts for temperature, precipitation, humidity, wind, city comparisons
- Forecasting with model leaderboard:
  - Moving Average Baseline
  - Linear Regression
  - Random Forest
  - Gradient Boosting
  - Ensemble (RF+GB)
- Metrics: MAE, RMSE, MAPE, R²
- Advanced analysis:
  - Anomaly detection (Isolation Forest)
  - Air quality trends/correlation/scatter
  - Feature importance
  - Climate patterns
- Spatial insights with world geo map and country summaries
- PM Accelerator mission page
- Final insights + assessment checklist

## Project Structure
```text
weather-trend-forecasting/
├── backend/
├── frontend/
├── data/
├── report/
├── README.md
└── .gitignore
```

## Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:5173`

## Dataset Placement Instructions
Place CSV exactly here:
`/Users/peddi/Documents/New project/weather-trend-forecasting/data/GlobalWeatherRepository.csv`

## API Endpoints
- `GET /`
- `GET /api/health`
- `GET /api/dataset-summary`
- `GET /api/cleaning-summary`
- `GET /api/eda/temperature-trends`
- `GET /api/eda/precipitation-trends`
- `GET /api/eda/correlation`
- `GET /api/eda/city-comparison`
- `GET /api/forecasting/model-comparison`
- `GET /api/forecasting/predictions`
- `GET /api/advanced/anomalies`
- `GET /api/advanced/air-quality`
- `GET /api/advanced/feature-importance`
- `GET /api/advanced/spatial-summary`
- `GET /api/advanced/climate-patterns`
- `GET /api/insights`

## Screenshots
Add screenshots in your GitHub repo under `report/screenshots/` and embed them here.

## Demo Video Script
See [report/demo_script.md](/Users/churnika/Documents/New project/weather-trend-forecasting/report/demo_script.md)

## Assessment Checklist
- [x] Data cleaning completed
- [x] EDA completed
- [x] Forecasting completed
- [x] Advanced analysis completed
- [x] PM Accelerator mission included
- [x] README included
- [x] Demo script included
- [x] GitHub-ready structure
