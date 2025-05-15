import { create } from "zustand";
import {
	SavedCompanyInfo,
	TrendingStockArrayStore,
	TrendingStock,
	SavedCompanyInfoStore,
} from "./types";
import { toast } from "react-toastify";

const notifyFailedSave = () =>
	toast.error("Failed to add to saved stocks", {
		hideProgressBar: true,
		autoClose: 1000,
	});
const notifySuccessfulSave = () =>
	toast.success("Added to saved company", {
		hideProgressBar: true,
		autoClose: 1000,
	});

export const useSavedStocksStore = create<SavedCompanyInfoStore>(
	(set, get) => ({
		isLoading: false,
		companyInView: null,
		setCompanyInView: (newCompany: SavedCompanyInfo) =>
			set(() => ({ companyInView: newCompany })),
		setIsLoading: (newState: boolean) =>
			set(() => ({ isLoading: newState })),
		companies: [],
		appendCompany: (newCompany: SavedCompanyInfo) =>
			set((state) => ({ companies: [...state.companies, newCompany] })),
		handleNewSavedCompany: (data: SavedCompanyInfo | null) => {
			const { setCompanyInView, setIsLoading, appendCompany } = get();

			if (data) {
				setCompanyInView(data);
				appendCompany(data);
				notifySuccessfulSave();
			} else {
				notifyFailedSave();
			}
			setIsLoading(false);
		},
	})
);

export const useTrendingStockArrayStore = create<TrendingStockArrayStore>(
	(set) => ({
		stocks: [],
		setStocks: (newStocks: TrendingStock[]) =>
			set(() => ({ stocks: newStocks })),
	})
);
