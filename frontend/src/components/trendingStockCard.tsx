import { TrendingStock } from "../utils/types";

interface TrendingStockCardProp {
	data: TrendingStock;
}

export const LOGO_KEY = import.meta.env.VITE_LOGO_KEY;

function increaseLabel(percentIncrease: string) {
	return (
		<div className="flex items-center rounded-3xl bg-green-200/30 text-green-600 px-2 py-1 text-xs">
			<i className="bi bi-arrow-up"></i>
			{percentIncrease}
		</div>
	);
}

export default function TrendingStockCard({ data }: TrendingStockCardProp) {
	const cleanedTicker = data.ticker.replace(/[^a-zA-Z0-9]/g, "");

	return (
		<div className="w-full p-4 bg-white border-1 border-gray-300 rounded-2xl flex flex-col gap-6 hover:shadow-lg transition-all">
			<div className="flex gap-2 items-center">
				<img
					className="aspect-square w-10 rounded-full border-1 border-gray-200"
					src={`https://img.logo.dev/ticker/${cleanedTicker}?token=${LOGO_KEY}`}
				></img>
				<span className="text-xl">{data.ticker}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-xl font-medium">${data.price}</span>

				{data.change_amount > 0
					? increaseLabel(data.change_percentage)
					: null}
			</div>
		</div>
	);
}
