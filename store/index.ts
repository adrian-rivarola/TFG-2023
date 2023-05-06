import { create } from "zustand";
import { Category } from "../data";

interface State {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<State>((set) => ({
  selectedCategories: [],
  setSelectedCategories: (categories: Category[]) => {
    set({ selectedCategories: categories });
  },
}));
