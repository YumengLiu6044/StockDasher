import { useEffect, useRef, useState } from "react";
import TrendingStockCard, { LOGO_KEY } from "./trendingStockCard";
import StockPriceView from "./stockPriceView";
import { SavedCompanyInfo, TrendingStock } from "../utils/types";
import { getTopEarners } from "../utils/fetch";

interface DashboardProps {
	savedStocks: SavedCompanyInfo[];
	setSavedStocks: React.Dispatch<React.SetStateAction<SavedCompanyInfo[]>>;
	stockInView: SavedCompanyInfo | null,
	setStockInView: React.Dispatch<React.SetStateAction<SavedCompanyInfo | null>>
}

const dropDownOptions = ["None", "Name", "Price", "Change"];

export default function Dashboard({
	savedStocks,
	setSavedStocks,
	stockInView,
	setStockInView
}: DashboardProps) {
	const divRef = useRef<HTMLDivElement | null>(null);
	const [sortOptionIndex, setSortOptionIndex] = useState(0);
	const [isSortIncrease, setIsSortIncrease] = useState(false);
	const [showSortOption, setShowOption] = useState(false);
	const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([])


	const dropDownRef = useRef<HTMLDivElement | null>(null);

	const handleClickSaved = (clickedSaved: SavedCompanyInfo) => {
		setStockInView(clickedSaved);
	};

	useEffect(() => {
		if (divRef.current) {
			getTopEarners().then((stocks) => {
				setTrendingStocks(stocks ?? [])
			})
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (dropDownRef.current) {
				const rect = dropDownRef.current.getBoundingClientRect();
				const clickedX = event.clientX;
				if (clickedX < rect.left || clickedX >= rect.right) {
					setShowOption(false);
					return;
				}
				const clickedY = event.clientY;
				if (clickedY < rect.top || clickedY >= rect.bottom) {
					setShowOption(false);
					return;
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const sortOption = dropDownOptions[sortOptionIndex];
		if (sortOption === "None") {
			return;
		}
		let sortedArray: SavedCompanyInfo[] = Array.from(savedStocks);
		switch (sortOption) {
			case "Name":
				sortedArray.sort((a, b) =>
					a.description.localeCompare(b.description)
				);
				break;

			case "Price":
				sortedArray.sort((a, b) => b.price - a.price);
				break;

			case "Change":
				sortedArray.sort((a, b) => b.change_percent - a.change_percent);
				break;

			default:
				break;
		}
		if (isSortIncrease) {
			sortedArray.reverse();
		}
		setSavedStocks(sortedArray);
	}, [sortOptionIndex, isSortIncrease]);

	return (
		<div className="bg-gray-100 h-full w-full p-5" ref={divRef}>
			<span className="text-xl">Trending Stocks</span>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-scroll pt-5">
				{trendingStocks.length > 0 &&
					trendingStocks.map((item, index) => (
						<div key={index} className="w-full">
							<TrendingStockCard data={item}></TrendingStockCard>
						</div>
					))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-5">
				<StockPriceView companyInView={stockInView}></StockPriceView>
				<div className="w-full flex flex-col gap-3">
					<div className="flex justify-between">
						<span className="text-xl">Saved Stocks</span>
						<div className="flex gap-2 items-center">
							<span className="text-gray-500">Sort By</span>
							<div className="relative">
								<span
									className="border-1 border-gray-300 rounded-2xl px-2 py-1 bg-white hover:bg-gray-300 transition-all"
									onClick={() => setShowOption(true)}
								>
									{dropDownOptions[sortOptionIndex]}
								</span>
								{showSortOption && (
									<div
										className="w-full z-10 absolute flex flex-col bg-white border-1 border-gray-300 rounded-2xl overflow-clip"
										ref={dropDownRef}
									>
										{dropDownOptions.map(
											(item, index) =>
												index !== sortOptionIndex && (
													<span
														key={index}
														className="hover:bg-gray-300 transition-all p-1 py-2"
														onClick={() => {
															setShowOption(
																false
															);
															setSortOptionIndex(
																index
															);
														}}
													>
														{item}
													</span>
												)
										)}
									</div>
								)}
							</div>
							<div
								className="hover:scale-110 transition-all"
								onClick={() => {
									setIsSortIncrease(!isSortIncrease);
								}}
							>
								<i
									className={`bi ${
										isSortIncrease
											? "bi-sort-up"
											: "bi-sort-down"
									} text-black`}
								></i>
							</div>
						</div>
					</div>
					<div
						className={`${
							savedStocks.length > 0 ? "" : "min-h-40"
						} bg-white border-1 border-gray-300 rounded-2xl flex flex-col overflow-scroll`}
					>
						{savedStocks.map((item, index) => {
							return (
								<div
									key={index}
									className={
										"fade-in flex gap-2 hover:bg-gray-300 transition-all px-3 py-2" +
										(index > 0
											? " border-t-1 border-gray-300 "
											: "")
									}
									onClick={() =>
										handleClickSaved(savedStocks[index])
									}
								>
									<img
										className="aspect-square w-10 h-10 rounded-full border-1 border-gray-200"
										src={`https://img.logo.dev/ticker/${item.symbol}?token=${LOGO_KEY}`}
									></img>
									<div className="flex w-full justify-between items-baseline">
										<div className="flex flex-col">
											<span className="font-medium text-lg">
												{item.symbol}
											</span>
											<span className=" text-gray-500">
												{item.description}
											</span>
										</div>

										<div className="flex flex-col items-end">
											<span className="font-medium text-lg">
												${item.price.toFixed(2)}
											</span>
											<span
												className={`${
													item.change_percent > 0
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{item.change_percent > 0
													? "+"
													: ""}
												{item.change_percent.toFixed(2)}
												%
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
