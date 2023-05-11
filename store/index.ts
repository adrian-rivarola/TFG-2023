import { create } from "zustand";
import { Category } from "../data";

interface State {
  allCategories: Category[];
  selectedCategories: Category[];
  setAllCategories: (categories: Category[]) => void;
  setSelectedCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<State>((set) => ({
  allCategories: [],
  selectedCategories: [],
  setSelectedCategories: (categories: Category[]) => {
    set({ selectedCategories: categories });
  },
  setAllCategories: (categories: Category[]) => {
    set({ allCategories: categories });
  },
}));
