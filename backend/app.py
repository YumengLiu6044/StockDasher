from dotenv import main
import os
import finnhub
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import uvicorn


main.load_dotenv()
# Finnhub setup
FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)

#Alpha Vantage Setup
ALPHA_V_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
ALPHA_V_URL = "https://www.alphavantage.co/query"

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


search_limit = 10


class SearchSymbol(BaseModel):
    query: str


@app.post("/searchSymbol")
async def searchStockSymbol(request: SearchSymbol):
    result = finnhub_client.symbol_lookup(request.query)
    result = result["result"][:search_limit]
    return result


class GetStockLogo(BaseModel):
    symbol: str


@app.post("/getStockLogo")
async def getStockLogo(request: GetStockLogo):
    result = finnhub_client.company_profile2(symbol=request.symbol)
    return result


class GetStockPrice(BaseModel):
    symbol: str
    function: str


@app.post("/getStockPrice")
async def getStockPrice(stock_request: GetStockPrice):
    query_format = f"function={stock_request.function}&symbol={stock_request.symbol}&apikey={ALPHA_V_KEY}"
    full_url = ALPHA_V_URL + "?" + query_format
    result = requests.get(full_url)
    return result.json()


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000, reload=True)
