import {
	GetPriceRequest,
	GetPriceResponse,
	SavedCompanyInfo,
} from "../utils/types";
import { useRef, useEffect, useState } from "react";
import {
	createChart,
	ColorType,
	IChartApi,
	CandlestickSeries,
	CandlestickData,
} from "lightweight-charts";
import { LOGO_KEY } from "./trendingStockCard";
import { getPrice } from "../utils/fetch";

interface StockPriceViewProps {
	companyInView: SavedCompanyInfo | null;
}

const Timeframes = [
	{
		label: "1Day",
		durationMs: 1 * 24 * 60 * 60 * 1000,
		aggregation: "10Min",
	},
	{ label: "1Week", durationMs: 7 * 24 * 60 * 60 * 1000, aggregation: "1H" },
	{
		label: "1Month",
		durationMs: 30 * 24 * 60 * 60 * 1000,
		aggregation: "3H",
	},
	{
		label: "12Month",
		durationMs: 365 * 24 * 60 * 60 * 1000,
		aggregation: "1D",
	},
	{
		label: "5Year",
		durationMs: 5 * 365 * 24 * 60 * 60 * 1000,
		aggregation: "1W"
	}
];

export default function StockPriceView({
	companyInView,
}: StockPriceViewProps) {
	const chartDivRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<IChartApi | null>(null)
	const [lastUpdatedTime, setLastUpdatedTime] = useState("");
	const [timeFrameIndex, setTimeFrameIndex] = useState(0);
	const [candleData, setCandleData] = useState<GetPriceResponse | null>(null);


	useEffect(() => {
		if (!companyInView) return;

		const timeInterval = Timeframes[timeFrameIndex].durationMs;
		const date = new Date()
		const currentDay = date.getDay()

		// Adjusts query start time to be no later than Thursday
		let dayOffset = 0
		if (currentDay > 4) {
			dayOffset = (currentDay - 5) * 24 * 3600 * 1000
		}
		// Time zone adjustments
		const offsetMiliseconds = date.getTimezoneOffset() * 60 * 1000;

		const startTime = new Date(date.getTime() - offsetMiliseconds - dayOffset - timeInterval).toISOString();
		const priceRequest: GetPriceRequest = {
			symbol: companyInView.symbol,
			timeframe: Timeframes[timeFrameIndex].aggregation,
			start: startTime,
		};
		getPrice(priceRequest).then((data) => {
			setCandleData(data);
		});
	}, [companyInView, timeFrameIndex]);

	useEffect(() => {
		if (chartDivRef.current) {
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

			chartRef.current = chart

			const resizeObserver = new ResizeObserver(() => {
				if (chartDivRef.current && chart) {
					chart.applyOptions({
						width: chartDivRef.current.clientWidth,
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

	useEffect(() => {
		if (!chartRef.current || !candleData) return

		const lastData = candleData[candleData.length - 1]
		const lastUpdate = new Date(lastData.time * 1000).toISOString()
		setLastUpdatedTime(lastUpdate)

		const candleSeries = chartRef.current.addSeries(CandlestickSeries, {
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
		candleSeries.setData(candleData as CandlestickData[]);
		chartRef.current.timeScale().fitContent();
		
		return () => chartRef.current?.removeSeries(candleSeries)
	}, [candleData])

	return (
		<div className="col-span-1 lg:col-span-2 min-h-100 bg-white border-1 border-gray-300 rounded-2xl p-5 flex flex-col gap-4">
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
			{companyInView && (
				<div className="w-full flex gap-3 border-t-1 border-gray-300 pt-3">
					{Timeframes.map((item, index) => (
						<span
							className={`text-xs rounded-2xl px-2 py-0.5  border-1 border-gray-300 ${
								index === timeFrameIndex
									? "bg-black text-white"
									: "bg-white hover:bg-gray-300"
							} transition-all`}
							key={index}
							onClick={() => setTimeFrameIndex(index)}
						>
							{item.label}
						</span>
					))}
				</div>
			)}
			<div ref={chartDivRef}></div>
		</div>
	);
}
