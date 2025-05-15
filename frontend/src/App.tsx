import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./components/dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StockSearchResult, TrendingStock } from "./utils/types";
import {
	searchCompanyInfo,
	getInfoFromRecommendation,
	getTopEarners,
} from "./utils/fetch";
import { toast, ToastContainer } from "react-toastify";
import { useSavedStocksStore, useTrendingStockArrayStore } from "./utils/store";

function App() {
	const divRef = useRef<HTMLDivElement | null>(null);
	const [showSideBar, setShowSideBar] = useState(true);

const savedStocks = useSavedStocksStore((state) => state.companies);
const isLoadingCompanyInfo = useSavedStocksStore((state) => state.isLoading);
const setIsLoadingCompanyInfo = useSavedStocksStore((state) => state.setIsLoading)
const handleNewSavedCompany = useSavedStocksStore((state) => state.handleNewSavedCompany)

	const notifyFailedToGetTrending = () =>
		toast.error("Failed to get trending stocks", {
			hideProgressBar: true,
			autoClose: 1000,
		});

	const setTrendingStocks = useTrendingStockArrayStore(
		(state) => state.setStocks
	);

	const handleClickSearchResult = (clickedResult: StockSearchResult) => {
		if (
			savedStocks
				.map((item) => item.symbol)
				.includes(clickedResult.symbol)
		) {
			console.log("Already contains");
			return;
		}

		if (isLoadingCompanyInfo) return;
		setIsLoadingCompanyInfo(true);
		searchCompanyInfo(clickedResult).then(handleNewSavedCompany);
	};

	const handleClickTrendingStock = (clickedStock: TrendingStock) => {
		const cleanedSymbol = clickedStock.ticker.replace(/[^a-zA-Z0-9]/g, "");
		if (savedStocks.map((item) => item.symbol).includes(cleanedSymbol)) {
			console.log("Already contains");
			return;
		}

		if (isLoadingCompanyInfo) return;
		setIsLoadingCompanyInfo(true);
		getInfoFromRecommendation(cleanedSymbol).then(handleNewSavedCompany);
	};

	useEffect(() => {
		if (divRef.current) {
			getTopEarners().then((stocks) => {
				setTrendingStocks(stocks ?? []);

				if (!stocks) {
					notifyFailedToGetTrending();
				}
			});
		}
	}, []);

	return (
		<div className="min-h-screen flex" ref={divRef}>
			<Sidebar showSidebar={showSideBar}></Sidebar>
			<div className="flex flex-col w-full">
				<ToastContainer></ToastContainer>
				<Topbar
					handleClickSearchResult={handleClickSearchResult}
					handleMenuButtonClick={() => {
						setShowSideBar(!showSideBar);
					}}
				></Topbar>
				<Dashboard
					handleClickTrendingStock={handleClickTrendingStock}
				></Dashboard>
			</div>
		</div>
	);
}

export default App;
