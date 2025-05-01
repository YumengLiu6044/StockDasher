import {
	StockSearchResult,
	SavedCompanyInfo,
	GetPriceRequest,
	GetPriceResponse,
	QuoteData,
	TrendingStock,
} from "./types";

const BACKEND_URL = "https://stockdasher.onrender.com";

export async function searchStock(query: string): Promise<StockSearchResult[]> {
	const request = { query: query };
	let searchData: StockSearchResult[] = [];

	try {
		const response = await fetch(BACKEND_URL + "/searchSymbol", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		searchData = (await response.json()) as StockSearchResult[];
	} catch (err) {
		console.log(err);
	}

	return searchData;
}

export async function searchCompanyInfo(
	stockSearch: StockSearchResult
): Promise<SavedCompanyInfo | null> {
	const request = { symbol: stockSearch.symbol };

	try {
		// Get quote
		const quoteResponse = await fetch(BACKEND_URL + "/getCompanyQuote", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		if (quoteResponse.status !== 200) return null;

		const quoteData = (await quoteResponse.json()) as QuoteData;
		if (!quoteData.dp || !quoteData.d) return null
		const companyInfo: SavedCompanyInfo = {
			symbol: stockSearch.symbol,
			description: stockSearch.description,
			price: quoteData.c,
			change_percent: quoteData.dp,
		};

		return companyInfo;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getPrice(request: GetPriceRequest): Promise<GetPriceResponse | null> {
	try {
		const response = await fetch(BACKEND_URL + "/getStockPrice", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		const data = await response.json();
		return data.data as GetPriceResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getTopEarners() : Promise<TrendingStock[] | null> {
	try {
		const response = await fetch(BACKEND_URL + "/getTopEearners", {
			method: "GET"
		});

		const data = await response.json();
		const stocks = data.top_gainers as TrendingStock[];
		return stocks.slice(0, 4)
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getInfoFromRecommendation(symbol:string): Promise<SavedCompanyInfo | null> {
	try {
		const response = await fetch(BACKEND_URL + "/getCompanyProfile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({query: symbol}),
		});

		const data = await response.json();
		console.log(data)

		if (JSON.stringify(data) === "{}") {
			return null
		}

		const infoRequest: StockSearchResult = {
			symbol: data["ticker"],
			displaySymbol: data["name"],
			type: data["Common"],
			description: data["name"]
		}

		return await searchCompanyInfo(infoRequest)
	} catch (error) {
		console.error(error);
		return null;
	}
}