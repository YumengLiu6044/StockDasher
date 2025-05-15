import { create } from "zustand";
import {
	SavedCompanyInfoStore,
	SavedCompanyInfoArrayStore,
	SavedCompanyInfo,
  TrendingStockArrayStore,
  TrendingStock,
  IsLoadingCompanyStore,
} from "./types";

export const useSavedStocksStore = create<SavedCompanyInfoArrayStore>(
	(set) => ({
		companies: [],
		setCompanies: (newCompanies: SavedCompanyInfo[]) =>
			set(() => ({
				companies: newCompanies,
			})),
		appendCompany: (newCompany: SavedCompanyInfo) =>
			set((state) => ({
				companies: [...state.companies, newCompany],
			})),
	})
);

export const useStockInViewStore = create<SavedCompanyInfoStore>((set) => ({
	company: null,
	setCompany: (newCompany: SavedCompanyInfo) =>
		set((_) => ({
			company: newCompany,
		})),
}));

export const useTrendingStockArrayStore = create<TrendingStockArrayStore>((set) => ({
  stocks: [],
  setStocks: (newStocks: TrendingStock[]) => set(() => ({stocks: newStocks}))
}))

export const useIsLoadingCompanyStore = create<IsLoadingCompanyStore>((set) => ({
  isLoading: false,
  setIsLoading: (newState: boolean) => set(() => ({isLoading: newState}))
}))
