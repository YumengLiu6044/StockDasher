const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1/";
const search_stock_symbol_url = BASE_URL + "search";
const company_logo_endpoint = BASE_URL + "stock/profile2";

export function searchStock(
	query: string,
	successCallback: (data: any) => void,
	failCallback?: () => void
) {
	const request = {
    q: query,
    token: FINNHUB_KEY
  }
  
  fetch(search_stock_symbol_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	})
		.then((response) => response.json())
		.then((data) => {
			successCallback(data);
			console.log(data);
		})
		.catch((error) => {
			console.error(error);
			failCallback?.call;
		});
}

