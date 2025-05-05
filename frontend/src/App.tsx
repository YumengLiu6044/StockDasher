import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./components/dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
	StockSearchResult,
	SavedCompanyInfo,
	TrendingStock,
} from "./utils/types";
import {
	searchCompanyInfo,
	getInfoFromRecommendation,
	getTopEarners,
} from "./utils/fetch";
import { ToastContainer, toast } from 'react-toastify';

function App() {
	const divRef = useRef<HTMLDivElement | null>(null);
	const [showSideBar, setShowSideBar] = useState(true);
	const [isLoadingCompanyInfo, setIsLoadingCompanyInfo] = useState(false);
	const [savedStocks, setSavedStocks] = useState<SavedCompanyInfo[]>([]);
	const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([]);
	const [stockInView, setStockInView] = useState<SavedCompanyInfo | null>(
		null
	);

	const notifyFailedSave = () => toast.error("Failed to add to saved stocks", {hideProgressBar: true, autoClose: 1000})
	const notifySuccessfulSave = () => toast.success("Added to saved company", {hideProgressBar: true, autoClose: 1000})
	const notifyFailedToGetTrending = () => toast.error("Failed to get trending stocks", {hideProgressBar: true, autoClose: 1000})

	const handleNewSavedCompany = (data: SavedCompanyInfo | null) => {
		if (data) {
			setStockInView(data);
			setSavedStocks([...savedStocks, data]);
			notifySuccessfulSave()
		}
		else {
			notifyFailedSave()
		}
		setIsLoadingCompanyInfo(false)
	}

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
					notifyFailedToGetTrending()
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
					trendingStocks={trendingStocks}
					handleClickTrendingStock={handleClickTrendingStock}
					isLoadingCompanyInfo={isLoadingCompanyInfo}
					setIsLoadingCompanyInfo={setIsLoadingCompanyInfo}
					stockInView={stockInView}
					setStockInView={setStockInView}
					savedStocks={savedStocks}
					setSavedStocks={setSavedStocks}
				></Dashboard>
			</div>
		</div>
	);
}

export default App;
