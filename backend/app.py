from dotenv import main
import os
import finnhub
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from finnhub import FinnhubAPIException
from pydantic import BaseModel
import uvicorn
import time
import requests
from datetime import datetime

main.load_dotenv()
# Finnhub setup
FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)
FINNHUB_URL = "https://finnhub.io/api/v1/search?q={}&exchange=US&token={}"

# Alpha Vantage Setup
ALPHA_V_KEY = os.getenv("ALPHA_V_API_KEY")
ALPHA_V_URL = "https://www.alphavantage.co/query"

#Alpaca setup
ALPACA_KEY_ID = os.getenv("ALPACA_KEY_ID")
ALPACA_SECRET_KEY = os.getenv("ALPACA_SECRET")
ALPACA_URL = "https://data.alpaca.markets/v2/stocks/{}/bars?"

alpaca_headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": ALPACA_KEY_ID,
    "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY
}


app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


search_limit = 5


class SearchSymbol(BaseModel):
    query: str

time_of_last_search = time.time()

def controlled_sleep(min_time_delta=1.0):
    global time_of_last_search
    current_time = time.time()
    delta = current_time - time_of_last_search
    if delta < min_time_delta:
        time.sleep(min_time_delta - delta)

    time_of_last_search = current_time


@app.post("/getCompanyProfile")
async def getCompanyProfile(request: SearchSymbol):
    controlled_sleep()
    try:
        response = finnhub_client.company_profile2(symbol=request.query)
    except FinnhubAPIException:
        raise HTTPException(status_code=401, detail="Symbol not found")

    return response

@app.post("/searchSymbol")
async def searchStockSymbol(request: SearchSymbol):
    controlled_sleep()
    request_url = FINNHUB_URL.format(request.query, FINNHUB_KEY)
    result = requests.get(request_url)

    if result.status_code != 200:
        raise HTTPException(status_code=401, detail=result.text)

    result = result.json()
    result = result["result"][:search_limit]
    return result


class SearchCompany(BaseModel):
    symbol: str

@app.post("/getCompanyQuote")
async def getCompanyQuote(request: SearchCompany):
    controlled_sleep()
    try:
        return finnhub_client.quote(request.symbol)

    except FinnhubAPIException:
        raise HTTPException(status_code=401, detail="Symbol not found")


class GetStockPrice(BaseModel):
    symbol: str
    timeframe: str = "1D"
    start: str = None


def format_data(entry):
    iso_time = entry["t"]
    iso_time = iso_time.replace("Z", "+00:00")
    dt = datetime.fromisoformat(iso_time)
    dt = int(dt.timestamp())
    return {
        "time": dt,
        "open": entry["o"],
        "close": entry["c"],
        "high": entry["h"],
        "low": entry["l"],
    }

@app.post("/getStockPrice")
async def getStockPrice(stock_request: GetStockPrice):
    controlled_sleep(0.3)
    params = {
        "timeframe": stock_request.timeframe,
        "start": stock_request.start,
        "page_token": None,
        "limit": 500
    }
    formatted_base = ALPACA_URL.format(stock_request.symbol)
    result = requests.get(formatted_base, params=params, headers=alpaca_headers)
    if result.status_code != 200:

        print(result.text)
        raise HTTPException(status_code=401, detail=result.text)

    results = result.json()
    bars = results.get("bars") or []
    if not bars:
        print(result.text)
        raise HTTPException(status_code=401, detail="No data found")

    page_token = results.get("next_page_token") or ""
    while page_token:
        params["page_token"] = page_token
        result = requests.get(formatted_base, params=params, headers=alpaca_headers)
        if result.status_code != 200:
            print(result.text)
            raise HTTPException(status_code=401, detail=result.text)

        result = result.json()
        page_token = result.get("next_page_token") or ""
        if not result.get("bars"):
            break

        bars.extend(result["bars"])
        controlled_sleep(0.1)

    formatted_data = [format_data(entry) for entry in bars]
    return {"data": formatted_data}


cached_result = None
last_earner_update = time.time()

@app.get("/getTopEearners")
async def getStockPrice():
    global cached_result, last_earner_update
    current_time = time.time()
    if cached_result and current_time - last_earner_update < 3600 * 12:
        return cached_result
    else:
        last_earner_update = current_time

    query_format = f"function=TOP_GAINERS_LOSERS&apikey={ALPHA_V_KEY}"
    full_url = ALPHA_V_URL + "?" + query_format
    result = requests.get(full_url)
    cached_result = result.json()
    return result.json()


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000, reload=True)
