from fastapi import FastAPI
import csv
import hashlib
from datetime import date
from pathlib import Path

app = FastAPI()

QUOTES = []
AUTHORS = set()

# --- Load CSV at startup ---
csv_path = Path(__file__).parent / "quotes.csv"
with open(csv_path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f, fieldnames=["quote", "author", "id"])
    for row in reader:
        if row["quote"] and row["author"] and row["quote"] != "quote":  # skip header
            QUOTES.append({"quote": row["quote"], "author": row["author"]})
            AUTHORS.add(row["author"])
AUTHORS = sorted(AUTHORS)


# --- Helpers ---
def get_daily_index() -> int:
    today = date.today().isoformat()
    h = hashlib.sha256(today.encode()).hexdigest()
    return int(h, 16) % len(QUOTES)


# --- API Endpoint ---
@app.get("/api/daily-puzzle")
def daily_puzzle():
    idx = get_daily_index()
    q = QUOTES[idx]
    return {
        "quote": q["quote"],
        "author": q["author"],
        "authorsList": AUTHORS,
        "attemptsAllowed": 13
    }
