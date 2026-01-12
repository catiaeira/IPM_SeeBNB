import os
import re
import sys
import pandas as pd

# =========================
# COLUMN DEFINITIONS
# =========================

LISTINGS_COLUMNS = [
    "id",
    "listing_url",
    "name",
    "host_total_listings_count",
    "neighbourhood_group_cleansed",
    "latitude",
    "longitude",
    "property_type",
    "room_type",
    "price",
    "estimated_occupancy_l365d",
    "review_scores_rating",
    "license",
    "estimated_revenue_l365d",
    "minimum_nights"
]

LISTINGS_NUMBERED_COLUMNS = [
    "id",
    "price",
    "estimated_occupancy_l365d",
    "property_type",
    "room_type",
    "host_total_listings_count",
    "neighbourhood_group_cleansed",
    "license",
    "minimum_nights"
]

# =========================
# LISTINGS CLEANING
# =========================

def clean_listings_csv(file_path: str):
    filename = os.path.basename(file_path)

    if filename == "listings.csv":
        keep_columns = LISTINGS_COLUMNS
    elif re.fullmatch(r"listings\(\d+\)\.csv", filename):
        keep_columns = LISTINGS_NUMBERED_COLUMNS
    else:
        return

    try:
        df = pd.read_csv(file_path)
        df = df[[c for c in keep_columns if c in df.columns]]
        df["price"] = (
            df["price"]
            .astype(str)
            .str.replace(r"[$,]", "", regex=True)
            .astype(float)
            .astype("Int64")
        )
        df.to_csv(file_path, index=False)
        print(f"Cleaned listings: {file_path}")
    except Exception as e:
        print(f"Failed listings file {file_path}: {e}")


# =========================
# CALENDAR COMPRESSION
# =========================

def compress_calendar_csv(file_path: str):
    try:
        df = pd.read_csv(file_path)

        df = df[["listing_id", "date", "available"]]

        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["available"] = df["available"].astype(str).str.lower().eq("t")

        df["year"] = df["date"].dt.year
        df["month"] = df["date"].dt.month

        summary = (
            df.groupby(["listing_id", "year", "month"])["available"]
            .sum()
            .reset_index(name="available_days")
        )

        summary.to_csv(file_path, index=False)
        print(f"Compressed calendar: {file_path}")

    except Exception as e:
        print(f"Failed calendar file {file_path}: {e}")
        
# =========================
# DIRECTORY WALK
# =========================

def process_directory(root_dir: str):
    for root, _, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(root, file)

            if file.lower().endswith(".csv"):
                if file.startswith("listings"):
                    clean_listings_csv(path)
                elif file == "calendar.csv":
                    compress_calendar_csv(path)


# =========================
# ENTRY POINT
# =========================

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scriptCleanCSVs.py <directory>")
        print(" - Directory must have the folder with the city data. \
            \n - The most recent listing should be called listings.csv, and the trimestral data should be listings(1).csv and listings(2).csv.\
            \n - Calendar data should be calendar.csv. \
            \n - These can be downloaded from https://insideairbnb.com/get-the-data.")
        sys.exit(1)

    process_directory(sys.argv[1])