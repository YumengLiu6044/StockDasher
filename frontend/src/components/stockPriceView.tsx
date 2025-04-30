import { GetPriceResponse, SavedCompanyInfo } from "../utils/types";
import { useRef, useEffect, useState } from "react";
import {
	createChart,
	AreaSeries,
	Time,
	ColorType,
	AreaData,
} from "lightweight-charts";
import { LOGO_KEY } from "./trendingStockCard";

interface StockPriceViewProps {
	candleData: GetPriceResponse | null;
	companyInView: SavedCompanyInfo | null;
	showCandle: boolean;
}

function getCurrentTime() {
	const date = new Date();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${hour}:${minutes}:${seconds}`;
}

const TimeFrames = ["1 Day", "1 Week", "1 Month", "1 Year", "All"];

export default function StockPriceView({
	candleData,
	companyInView,
	showCandle,
}: StockPriceViewProps) {
	const chartDivRef = useRef<HTMLDivElement | null>(null);
	const [lastUpdatedTime, setLastUpdatedTime] = useState(getCurrentTime());

	const [areaData, setAreaData] = useState<AreaData<Time>[]>(
		candleData?.map((item) => ({
			time: item.time,
			value: item.close,
		})) as AreaData<Time>[]
	);

	useEffect(() => {
		setLastUpdatedTime(getCurrentTime());
	}, [companyInView]);

	useEffect(() => {
		if (chartDivRef.current) {
			// Update areaData when candleData changes
			setAreaData(
				candleData?.map((item) => ({
					time: item.time,
					value: item.close,
				})) as AreaData<Time>[]
			);

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
					borderColor: "transparent",
				},
				timeScale: {
					borderColor: "transparent",
				},
				width: chartDivRef.current.clientWidth * 0.95,
				height: 400,
			});

			if (areaData && areaData.length > 0) {
				const areaSeries = chart.addSeries(AreaSeries, {
					lineColor: "#2962FF",
					topColor: "#2962FF",
					bottomColor: "rgba(41, 98, 255, 0.28)",
				});

				areaSeries.setData(areaData);
			}
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
	}, [candleData]);

	return (
		<div className="w-full h-full min-h-100 bg-white border-1 border-gray-300 rounded-2xl p-5 flex flex-col gap-4">
			{companyInView && (
				<div className="flex justify-between">
					<div className="flex gap-2">
						<img
							className="col-span-1 row-span-2 aspect-square w-12 h-12 rounded-full border-1 border-gray-200"
							src={`https://img.logo.dev/ticker/${companyInView?.symbol}?token=${LOGO_KEY}`}
						></img>
						<div className="flex flex-col">
							<span className="text-lg font-medium">
								{companyInView?.description}
							</span>
							<span className="text-gray-500">
								{companyInView?.symbol}
							</span>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="flex gap-3 justify-end items-center">
							<span
								className={`text-xs text-white rounded-2xl px-2 py-0.5 ${
									companyInView.change_percent > 0
										? "bg-green-500"
										: "bg-red-500"
								}`}
							>
								{companyInView.change_percent > 0 ? "+" : ""}
								{companyInView.change_percent.toFixed(2)}%
								<i
									className={`bi ${
										companyInView.change_percent > 0
											? "bi-arrow-up"
											: "bi-arrow-down"
									} text-white`}
								></i>
							</span>
							<span className="text-lg">
								${companyInView.price}
							</span>
						</div>
						<span className="text-gray-400">
							Last Updated at {lastUpdatedTime}
						</span>
					</div>
				</div>
			)}
			<div className="w-full flex justify-between border-t-1 border-gray-300 pt-3">
				{TimeFrames.map((item, index) => (
					<div className="text-xs rounded-2xl px-2 py-0.5 bg-white border-1 border-gray-300" key={index}>
						{item}
					</div>
				))}
			</div>
			<div ref={chartDivRef}></div>
		</div>
	);
}
