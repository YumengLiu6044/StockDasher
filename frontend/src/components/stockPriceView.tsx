import { GetPriceResponse, SavedCompanyInfo } from "../utils/types";
import { useRef, useEffect, useState } from "react";
import {
	createChart,
	AreaSeries,
	Time,
	ColorType,
	AreaData,
} from "lightweight-charts";

interface StockPriceViewProps {
	candleData: GetPriceResponse | null;
	companyInView: SavedCompanyInfo | null;
	showCandle: boolean;
}

export default function StockPriceView({
	candleData,
	companyInView,
	showCandle,
}: StockPriceViewProps) {
	const chartDivRef = useRef<HTMLDivElement | null>(null);
	const [areaData, setAreaData] = useState<AreaData<Time>[]>(
		candleData?.map((item) => ({
			time: item.time,
			value: item.close,
		})) as AreaData<Time>[]
	);

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
		<div
			className="col-span-1 lg:col-span-2 h-full bg-white border-1 border-gray-300 rounded-2xl p-3"
			ref={chartDivRef}
		></div>
	);
}
