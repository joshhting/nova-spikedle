import json
from datetime import date
from load_quotes import load_quotes_from_local

def get_daily_quote():
	quotes, authors = load_quotes_from_local()
	today = date.today()
	idx = today.toordinal() % len(quotes)
	return quotes[idx]["quote"], quotes[idx]["author"], authors

# --- API Endpoint ---
def lambda_handler(event, context):
	quote, author, authors = get_daily_quote()
	print(f"{author}: {quote}")
	return {
		"statusCode": 200,
		"headers": {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"  # allow frontend to call
		},
		"body": json.dumps({
			"quote": quote,
			"author": author,
			"possible_authors": authors
		})
	}
