import { useEffect, useRef, useState } from "react";
import TrendingStockCard from "./trendingStockCard";
import { sampleDailyStock, sampleTrendingStocks } from "../assets/sampleData";
import { createChart, AreaSeries, Time, ColorType } from "lightweight-charts";
import { SavedCompanyInfo } from "../utils/types";
import { LOGO_KEY } from "./trendingStockCard";

interface DashboardProps {
	savedStocks: SavedCompanyInfo[];
	stockInView: SavedCompanyInfo | null;
}

export default function Dashboard({
	savedStocks,
	stockInView,
}: DashboardProps) {
	const divRef = useRef<HTMLDivElement | null>(null);
	const chartDivRef = useRef<HTMLDivElement | null>(null);
	const stockTimeSeriesData = Object.entries(
		sampleDailyStock["Weekly Time Series"]
	)
		.map((item) => ({
			time: Math.floor(new Date(item[0]).getTime() / 1000) as Time,
			value: Number(item[1]["4. close"]),
		}))
		.reverse();

	useEffect(() => {
		if (chartDivRef.current) {
			console.log("Calling");
			const chart = createChart(chartDivRef.current, {
				layout: {
					textColor: "black",
					background: {
						type: ColorType.Solid,
						color: "white",
					},
				},
				grid: {
					vertLines: {
						color: "transparent",
					},
				},
				rightPriceScale: {
					borderColor: "transparent", // no border on the right
				},
				timeScale: {
					borderColor: "transparent", // remove bottom border
				},
				width: chartDivRef.current.clientWidth * 0.95,
				height: 400,
			});

			const areaSeries = chart.addSeries(AreaSeries, {
				lineColor: "#2962FF",
				topColor: "#2962FF",
				bottomColor: "rgba(41, 98, 255, 0.28)",
			});

			areaSeries.setData(stockTimeSeriesData);
			chart.timeScale().fitContent();

			const resizeObserver = new ResizeObserver(() => {
				if (chartDivRef.current && chart) {
					chart.applyOptions({
						width: chartDivRef.current.clientWidth * 0.95,
					});
					chart.timeScale().fitContent();
				}
			});

			resizeObserver.observe(chartDivRef.current);

			return () => {
				chart.remove(), resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<div className="bg-gray-100 h-full w-full p-5" ref={divRef}>
			<span className="text-xl">Trending Stocks</span>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-scroll pt-5">
				{sampleTrendingStocks.length > 0 &&
					sampleTrendingStocks.map((item, index) => (
						<div key={index} className="w-full">
							<TrendingStockCard data={item}></TrendingStockCard>
						</div>
					))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 py-5 gap-5">
				<div
					className="col-span-1 lg:col-span-2 h-full bg-white border-1 border-gray-300 rounded-2xl p-3"
					ref={chartDivRef}
				></div>
				<div className="cols-span-1 flex flex-col gap-3">
					<span className="text-xl">Saved Stocks</span>
					<div className="min-h-40 bg-white border-1 border-gray-300 rounded-2xl p-3 flex flex-col gap-3 overflow-scroll ">
						{savedStocks.map((item, index) => {
							return (
							<div key={index} className={"flex gap-2 " + (index > 0 ? "border-t-1 border-gray-300 pt-3" : "")}>
								<img
									className="aspect-square w-10 h-10 rounded-full border-1 border-gray-200"
									src={`https://img.logo.dev/ticker/${item.symbol}?token=${LOGO_KEY}`}
								></img>
								<div className="flex w-full justify-between items-baseline">
									<div className="flex flex-col">
										<span className="font-medium text-lg">{item.symbol}</span>
										<span className=" text-gray-500">{item.description}</span>
									</div>

									<div className="flex flex-col">
										<span className="font-medium text-lg">${item.price}</span>
										<span className={" text-gray-500 " + (item.change_percent > 0 ? "text-green-500" : "text-red-500")}>{item.change_percent > 0 ? "+" : "-"}{item.change_percent}%</span>
									</div>
								</div>
							</div>
						)})}
					</div>
				</div>
			</div>
		</div>
	);
}
