import { create } from 'zustand';

import { Category, CategoryType } from '@/data';

export type TransactionFilter = {
  categoryType?: CategoryType;
  categories?: number[];
};

interface State {
  activeFilters: TransactionFilter;
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  setActiveFilters: (filters: TransactionFilter) => void;
}

export const useMainStore = create<State>((set) => ({
  activeFilters: {},
  selectedCategories: [],
  setSelectedCategories: (categories: Category[]) => {
    set({ selectedCategories: categories });
  },
  setActiveFilters: (filters: TransactionFilter) => {
    set({ activeFilters: filters });
  },
}));
