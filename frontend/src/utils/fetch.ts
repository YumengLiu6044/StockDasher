const BACKEND_URL = "http://0.0.0.0:10000";

export type StockSearchResult = {
	symbol: string;
	description: string;
	type: string;
	displaySymbol: string;
};

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
	console.log(searchData);
	return searchData;
}

type QuoteData = {
	c: number; // current price
	h: number; // high price of the day
	l: number; // low price of the day
	o: number; // open price of the day
	pc: number; // previous close price
	t: number; // timestamp (Unix time)
};

export type SavedCompanyInfo = {
	symbol: string;
	description: string;
	price: number;
	change_percent: number;
};

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

		if (quoteResponse.status !== 200) return null

		const quoteData = (await quoteResponse.json()) as QuoteData;

		const companyInfo: SavedCompanyInfo = {
			symbol: stockSearch.symbol,
			description: stockSearch.description,
			price: quoteData.c,
			change_percent: quoteData.pc,
		};
		return companyInfo;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getPrice(
	symbol: string,
	priceFunction: string
): Promise<any | null> {
	const request = {
		symbol: symbol,
		function: priceFunction,
	};

	try {
		const response = await fetch(BACKEND_URL + "/getStockPrice", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export type TrendingStock = {
	change_amount: number;
	change_percentage: string;
	price: number;
	ticker: string;
	volume: number;
};
