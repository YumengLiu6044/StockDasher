import {
	StockSearchResult,
	SavedCompanyInfo,
	GetPriceRequest,
	GetPriceResponse,
	QuoteData,
} from "./types";

const BACKEND_URL = "http://0.0.0.0:10000";

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

		const data = await response.json() as GetPriceResponse;
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
