from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler


NUMERIC_TARGET = "temperature_celsius"


def preprocess_dataset(df: pd.DataFrame):
    working = df.copy()
    working.loc[:, "last_updated"] = pd.to_datetime(working["last_updated"], errors="coerce")
    working = working.dropna(subset=["last_updated"]).reset_index(drop=True)

    numeric_cols = working.select_dtypes(include=[np.number]).columns.tolist()
    non_numeric_cols = [c for c in working.columns if c not in numeric_cols]

    missing_before = working.isna().sum().to_dict()

    for col in numeric_cols:
        med = working[col].median()
        working.loc[:, col] = working[col].fillna(med)

    for col in non_numeric_cols:
        mode = working[col].mode(dropna=True)
        fill_value = mode.iloc[0] if not mode.empty else "Unknown"
        working.loc[:, col] = working[col].fillna(fill_value)

    outlier_summary = {}
    outlier_rows = set()
    for col in numeric_cols:
        q1, q3 = working[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        low = q1 - 1.5 * iqr
        high = q3 + 1.5 * iqr
        mask = (working[col] < low) | (working[col] > high)
        outlier_summary[col] = int(mask.sum())
        outlier_rows.update(working.index[mask].tolist())
        working.loc[:, col] = working[col].clip(low, high)

    scaler = StandardScaler()
    normalized_df = working.copy()
    if numeric_cols:
        normalized_df.loc[:, numeric_cols] = scaler.fit_transform(working[numeric_cols])

    missing_after = working.isna().sum().to_dict()

    summary = {
        "rows_before": int(len(df)),
        "rows_after": int(len(working)),
        "numeric_columns": numeric_cols,
        "missing_values_before": missing_before,
        "missing_values_after": missing_after,
        "outlier_counts_by_column": outlier_summary,
        "unique_outlier_rows_affected": int(len(outlier_rows)),
        "normalization": "StandardScaler on all numeric columns",
        "target_column": NUMERIC_TARGET,
    }

    return working, normalized_df, summary
