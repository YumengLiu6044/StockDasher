import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./components/dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
	getTopEarners,
} from "./utils/fetch";
import { toast, ToastContainer } from "react-toastify";
import { useTrendingStockArrayStore } from "./utils/store";

function App() {
	const divRef = useRef<HTMLDivElement | null>(null);
	const [showSideBar, setShowSideBar] = useState(true);

	const notifyFailedToGetTrending = () =>
		toast.error("Failed to get trending stocks", {
			hideProgressBar: true,
			autoClose: 1000,
		});

	const setTrendingStocks = useTrendingStockArrayStore(
		(state) => state.setStocks
	);

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
					handleMenuButtonClick={() => {
						setShowSideBar(!showSideBar);
					}}
				></Topbar>
				<Dashboard></Dashboard>
			</div>
		</div>
	);
}

export default App;
