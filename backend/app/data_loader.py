from __future__ import annotations

from pathlib import Path
from typing import Tuple

import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data" / "GlobalWeatherRepository.csv"


class DatasetNotFoundError(FileNotFoundError):
    pass


def load_dataset() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise DatasetNotFoundError(
            "Dataset not found. Download the Global Weather Repository CSV from Kaggle and "
            "place it inside the data folder as `GlobalWeatherRepository.csv`."
        )

    df = pd.read_csv(DATA_PATH)
    if "last_updated" not in df.columns:
        raise ValueError("CSV missing required column: last_updated")

    df.loc[:, "last_updated"] = pd.to_datetime(df["last_updated"], errors="coerce")
    df = df.dropna(subset=["last_updated"]).sort_values("last_updated").reset_index(drop=True)
    return df


def get_dataset_metadata(df: pd.DataFrame) -> Tuple[int, int, list[str]]:
    return len(df), len(df.columns), list(df.columns)
