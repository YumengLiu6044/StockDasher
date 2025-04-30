import { useState } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./components/dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StockSearchResult, SavedCompanyInfo } from "./utils/types";
import { searchCompanyInfo } from "./utils/fetch";

function App() {
	const [showSideBar, setShowSideBar] = useState(true);
	
	const [isLoadingCompanyInfo, setIsLoadingCompanyInfo] = useState(false);
	const [savedStocks, setSavedStocks] = useState<SavedCompanyInfo[]>([]);

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
		searchCompanyInfo(clickedResult).then((data) => {
			if (data) {
				setSavedStocks([...savedStocks, data]);
			}
			setIsLoadingCompanyInfo(false);
		});
	};

	return (
		<div className="min-h-screen flex">
			<Sidebar showSidebar={showSideBar}></Sidebar>

			<div className="flex flex-col w-full">
				<Topbar
					handleClickSearchResult={handleClickSearchResult}
					handleMenuButtonClick={() => {
						setShowSideBar(!showSideBar);
					}}
				></Topbar>
				<Dashboard
					savedStocks={savedStocks}
					setSavedStocks={setSavedStocks}
				></Dashboard>
			</div>
		</div>
	);
}

export default App;
