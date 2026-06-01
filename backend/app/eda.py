from __future__ import annotations

import numpy as np
import pandas as pd


def _trend(df: pd.DataFrame, value_col: str, agg: str = "mean") -> list[dict]:
    series = (
        df.set_index("last_updated")[value_col]
        .resample("D")
        .agg(agg)
        .dropna()
        .reset_index()
    )
    return [
        {"date": d.strftime("%Y-%m-%d"), value_col: float(v)}
        for d, v in series[["last_updated", value_col]].itertuples(index=False)
    ]


def temperature_trends(df: pd.DataFrame):
    df = df.copy()
    df.loc[:, "last_updated"] = pd.to_datetime(df["last_updated"], errors="coerce")
    df = df.dropna(subset=["last_updated"])

    t = (
        df.set_index("last_updated")["temperature_celsius"]
        .resample("D")
        .mean()
        .dropna()
        .reset_index()
    )
    t.loc[:, "rolling_7d"] = t["temperature_celsius"].rolling(7, min_periods=1).mean()

    country_avg = (
        df.groupby("country", as_index=False)["temperature_celsius"]
        .mean()
        .sort_values("temperature_celsius", ascending=False)
        .head(15)
    )

    weather_dist = (
        df.groupby("condition_text", as_index=False)
        .size()
        .sort_values("size", ascending=False)
        .head(12)
        .rename(columns={"size": "count"})
    )

    return {
        "temperature_points": [
            {
                "date": d.strftime("%Y-%m-%d"),
                "temperature_celsius": float(temp),
                "rolling_7d": float(r7),
            }
            for d, temp, r7 in t[["last_updated", "temperature_celsius", "rolling_7d"]].itertuples(index=False)
        ],
        "humidity_points": _trend(df, "humidity", agg="mean"),
        "wind_points": _trend(df, "wind_kph", agg="mean"),
        "country_avg_temp": country_avg.round(3).to_dict(orient="records"),
        "weather_condition_distribution": weather_dist.to_dict(orient="records"),
        "summary": {
            "min": float(t["temperature_celsius"].min()) if not t.empty else None,
            "max": float(t["temperature_celsius"].max()) if not t.empty else None,
            "avg": float(t["temperature_celsius"].mean()) if not t.empty else None,
        },
    }


def precipitation_trends(df: pd.DataFrame):
    df = df.copy()
    df.loc[:, "last_updated"] = pd.to_datetime(df["last_updated"], errors="coerce")
    df = df.dropna(subset=["last_updated"])

    points = _trend(df, "precip_mm", agg="sum")
    return {
        "points": points,
        "summary": {
            "total_precip_mm": float(sum(p["precip_mm"] for p in points)) if points else 0.0,
            "max_day_precip_mm": float(max((p["precip_mm"] for p in points), default=0.0)),
        },
    }


def correlation_analysis(df: pd.DataFrame):
    numeric = df.select_dtypes(include=[np.number])
    corr = numeric.corr(numeric_only=True).fillna(0.0)

    matrix = []
    for row in corr.index:
        matrix.append({"feature": row, **{col: float(corr.loc[row, col]) for col in corr.columns}})

    target = "temperature_celsius"
    target_corr = corr[target].sort_values(ascending=False) if target in corr.columns else pd.Series(dtype=float)

    top_pos = [
        {"feature": idx, "correlation": float(val)}
        for idx, val in target_corr.drop(labels=[target], errors="ignore").head(8).items()
    ]
    top_neg = [
        {"feature": idx, "correlation": float(val)}
        for idx, val in target_corr.sort_values().head(8).items()
    ]

    return {
        "matrix": matrix,
        "top_positive_with_temperature": top_pos,
        "top_negative_with_temperature": top_neg,
    }


def city_comparison(df: pd.DataFrame):
    grouped = (
        df.groupby(["country", "location_name"], as_index=False)
        .agg(
            avg_temp=("temperature_celsius", "mean"),
            avg_precip=("precip_mm", "mean"),
            avg_humidity=("humidity", "mean"),
        )
    )

    hottest = grouped.sort_values("avg_temp", ascending=False).head(10)
    coldest = grouped.sort_values("avg_temp", ascending=True).head(10)
    wettest = grouped.sort_values("avg_precip", ascending=False).head(10)

    return {
        "hottest_cities": hottest.round(3).to_dict(orient="records"),
        "coldest_cities": coldest.round(3).to_dict(orient="records"),
        "wettest_cities": wettest.round(3).to_dict(orient="records"),
    }
