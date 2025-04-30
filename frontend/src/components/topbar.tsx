import { useState, useEffect, useRef } from "react";
import headshot from "../assets/yumeng.jpeg";
import loading from "../assets/loading.svg";
import { searchStock } from "../utils/fetch";
import { StockSearchResult } from "../utils/types";

interface TopBarProp {
	handleMenuButtonClick: () => void;
	handleClickSearchResult: (clickedResult: StockSearchResult) => void;
}

export default function Topbar(prop: TopBarProp) {
	const [query, setQuery] = useState("");
	const [debouncedInput, setDebouncedInput] = useState("");
	const [showSearchResult, setShowSearchResult] = useState(false)
	const [isLoading, setIsLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<
		StockSearchResult[] | null
	>(null);
	const searchResultRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedInput(query);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	useEffect(() => {
		if (debouncedInput && !isLoading) {
			setIsLoading(true);
			setShowSearchResult(true)
			searchStock(debouncedInput).then((data) => {
				setSearchResults(data);
				setIsLoading(false);
			});
		}
	}, [debouncedInput]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			console.log("Clicked")
			if (searchResultRef.current) {
				const rect = searchResultRef.current.getBoundingClientRect();
				const clickedX = event.clientX;
				if (clickedX < rect.left || clickedX >= rect.right) {
					setShowSearchResult(false);
					return;
				}
				const clickedY = event.clientY;
				if (clickedY < rect.top || clickedY >= rect.bottom) {
					setShowSearchResult(false);
					return;
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="w-full flex items-center justify-between border-b-1 border-gray-300 py-5 px-13">
			<div className="flex gap-3 w-full">
				<i
					className="bi bi-list rounded-xl border-1 border-gray-300 text-gray-600 p-2 hover:bg-gray-200 transition-all"
					onClick={prop.handleMenuButtonClick}
				></i>
				<div className="relative max-w-80 w-full">
					<i className="absolute left-3 top-2 bi bi-search text-gray-600 text-lg"></i>
					{isLoading && (
						<img
							src={loading}
							className="aspect-square w-8 absolute right-3 top-1 rounded-full"
						></img>
					)}
					<input
						type="text"
						className="rounded-xl border-1 border-gray-300 p-2 pl-10 w-full"
						placeholder="Search for stocks"
						onChange={(e) => {
							setQuery(e.target.value);
							setSearchResults(null);
						}}
					></input>

					{(searchResults && showSearchResult) &&
						searchResults.length > 0 &&
						query.length > 0 && (
							<div
								className="w-full absolute flex flex-col gap-3 rounded-xl border-1 border-gray-300 bg-white overflow-clip"
								ref={searchResultRef}
							>
								{searchResults.map((item, index) => (
									<div
										className="flex gap-2 items-center justify-between px-2 py-0.5 hover:bg-gray-300 transition-all"
										onClick={() =>
											prop.handleClickSearchResult(
												searchResults[index]
											)
										}
										key={index}
									>
										<span className="font-medium">
											{item.symbol}
										</span>
										<span className="text-gray-600 whitespace-nowrap overflow-ellipsis">
											{item.description}
										</span>
									</div>
								))}
							</div>
						)}
				</div>
			</div>

			<div className="hidden lg:flex gap-5 items-center justify-end w-full">
				<div className="flex gap-5 border-r-1 border-gray-300 px-3">
					<i className="bi bi-envelope text-gray-600 text-2xl p-2 hover:scale-120 transition-all"></i>
					<i className="bi bi-bell text-gray-600 text-2xl p-2 hover:scale-120 transition-all"></i>
				</div>

				<div className="flex gap-5 items-center justify-between">
					<img
						className="w-12 aspect-square rounded-full border-1 border-gray-300"
						src={headshot}
					></img>
					<span className="w-full text-xl whitespace-nowrap">
						Yumeng Liu
					</span>
				</div>
			</div>
		</div>
	);
}
