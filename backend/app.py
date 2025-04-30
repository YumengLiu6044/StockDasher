from dotenv import main
import os
import finnhub
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from finnhub import FinnhubAPIException
from pydantic import BaseModel
import uvicorn
import time
from pprint import pprint
import requests


main.load_dotenv()
# Finnhub setup
FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)
FINNHUB_URL = "https://finnhub.io/api/v1/search?q={}&exchange=US&token={}"

#Alpha Vantage Setup
ALPHA_V_KEY = os.getenv("ALPHA_V_API_KEY")
ALPHA_V_URL = "https://www.alphavantage.co/query"

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


@app.post("/searchSymbol")
async def searchStockSymbol(request: SearchSymbol):
    time.sleep(1)
    request_url = FINNHUB_URL.format(request.query, FINNHUB_KEY)
    result = requests.get(request_url).json()
    result = result["result"][:search_limit]
    pprint(result)
    return result


class SearchCompany(BaseModel):
    symbol: str

@app.post("/getCompanyQuote")
async def getCompanyQuote(request: SearchCompany):
    time.sleep(1)
    try:
        return finnhub_client.quote(request.symbol)

    except FinnhubAPIException as e:
        raise HTTPException(status_code=401, detail="Symbol not found")


class GetStockPrice(BaseModel):
    symbol: str
    function: str


@app.post("/getStockPrice")
async def getStockPrice(stock_request: GetStockPrice):
    time.sleep(1)
    query_format = f"function={stock_request.function}&symbol={stock_request.symbol}&apikey={ALPHA_V_KEY}"
    full_url = ALPHA_V_URL + "?" + query_format
    result = requests.get(full_url)
    return result.json()


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000, reload=True)
