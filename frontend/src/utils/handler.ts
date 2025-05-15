import { getInfoFromRecommendation, searchCompanyInfo } from "./fetch";
import { useSavedStocksStore } from "./store";
import { StockSearchResult, TrendingStock } from "./types";

export const handleClickSearchResult = (clickedResult: StockSearchResult) => {
	const {
		companies: savedStocks,
		isLoading: isLoadingCompanyInfo,
		setIsLoading: setIsLoadingCompanyInfo,
		handleNewSavedCompany,
	} = useSavedStocksStore.getState();
	if (savedStocks.map((item) => item.symbol).includes(clickedResult.symbol)) {
		console.log("Already contains");
		return;
	}

	if (isLoadingCompanyInfo) return;
	setIsLoadingCompanyInfo(true);
	searchCompanyInfo(clickedResult).then(handleNewSavedCompany);
};

export const handleClickTrendingStock = (clickedStock: TrendingStock) => {
	const {
		companies: savedStocks,
		isLoading: isLoadingCompanyInfo,
		setIsLoading: setIsLoadingCompanyInfo,
		handleNewSavedCompany,
	} = useSavedStocksStore.getState();
	const cleanedSymbol = clickedStock.ticker.replace(/[^a-zA-Z0-9]/g, "");
	if (savedStocks.map((item) => item.symbol).includes(cleanedSymbol)) {
		console.log("Already contains");
		return;
	}

	if (isLoadingCompanyInfo) return;
	setIsLoadingCompanyInfo(true);
	getInfoFromRecommendation(cleanedSymbol).then(handleNewSavedCompany);
};
