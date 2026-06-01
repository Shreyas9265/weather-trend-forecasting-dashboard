# Weather Trend Forecasting - Project Report

## Objective
Build a full-stack, production-style weather trend forecasting dashboard using the Kaggle Global Weather Repository dataset.

## Completed Scope
- Data cleaning and preprocessing
- Missing value handling
- Outlier handling (IQR clipping)
- Numeric normalization (StandardScaler)
- Time-series analysis based on `last_updated`
- EDA: temperature, precipitation, and correlations
- Forecasting models with comparison
- Evaluation metrics: MAE, RMSE, MAPE, R²
- Advanced analysis: anomaly detection, climate patterns, air-quality correlation, feature importance, spatial analysis
- Professional React dashboard and FastAPI backend
- PM Accelerator mission page

## Model Notes
- Baseline models: Linear Regression and Random Forest Regressor
- Best model selected by RMSE on time-ordered holdout split
- Forecast endpoint returns test-set predictions and future horizon predictions
