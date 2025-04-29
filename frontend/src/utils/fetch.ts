const BACKEND_URL = "http://0.0.0.0:10000";

export type StockSearchResult = {
	symbol: string;
	description: string;
	type: string;
	displaySymbol: string;
};

export async function searchStock(query: string): Promise<StockSearchResult[]> {
	const request = { query };
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
	console.log(searchData)
	return searchData;
}

export async function getStockLogo(symbol: string): Promise<any | null> {
	const request = { symbol: symbol };

	try {
		const response = await fetch(BACKEND_URL + "/getStockLogo", {
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

export async function getPrice(symbol: string, priceFunction: string): Promise<any | null> {
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
