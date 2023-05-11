import { useQuery } from "react-query";
import { Category } from "../../data";
import { useCategoryStore } from "../../store";

export const CATEGORIES_QUERY_KEY = "categories";

export function useGetCategories() {
  const setAllCategories = useCategoryStore((state) => state.setAllCategories);

  return useQuery([CATEGORIES_QUERY_KEY], async () => {
    const categories = await Category.find();
    setAllCategories(categories);
    return categories;
  });
}
