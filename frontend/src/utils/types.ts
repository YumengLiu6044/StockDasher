export type StockSearchResult = {
	symbol: string;
	description: string;
	type: string;
	displaySymbol: string;
};

export type QuoteData = {
	c: number;
	h: number;
	l: number;
	o: number;
	pc: number;
	t: number;
	dp: number;
	d: number;
};

export type SavedCompanyInfo = {
	symbol: string;
	description: string;
	price: number;
	change_percent: number;
};

export type SavedCompanyInfoStore = {
	company: SavedCompanyInfo | null
	setCompany: (newCompany: SavedCompanyInfo) => void
}

export type SavedCompanyInfoArrayStore = {
	companies: SavedCompanyInfo[];
	setCompanies: (newCompanies: SavedCompanyInfo[]) => void;
	appendCompany: (newCompany: SavedCompanyInfo) => void;
};

export type GetPriceRequest = {
	symbol: string;
	timeframe: string;
	start: string;
};

export type GetPriceResponse = {
	time: number;
	open: number;
	close: number;
	high: number;
	low: number;
}[];

export type TrendingStock = {
	change_amount: number;
	change_percentage: string;
	price: number;
	ticker: string;
	volume: number;
};

export type TrendingStockArrayStore = {
	stocks: TrendingStock[];
	setStocks: (newStocks: TrendingStock[]) => void;
};

export type IsLoadingCompanyStore = {
	isLoading: boolean
	setIsLoading: (newState: boolean) => void
}