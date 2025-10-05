import csv
import io
from pathlib import Path

QUOTES_S3_BUCKET = "nova-quordle-csv"

def load_quotes_from_local():
    quotes = []
    authors = set()
    csv_path = "quotes.csv"
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, fieldnames=["quote", "author", "id"])
        for row in reader:
            if row["quote"] and row["author"] and row["quote"] != "quote":  # skip header
                quotes.append({"quote": row["quote"], "author": row["author"]})
                authors.add(row["author"])
    return quotes, sorted(list(authors))


