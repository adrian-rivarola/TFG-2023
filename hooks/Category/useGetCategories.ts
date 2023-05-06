import { useQuery } from "react-query";
import { Category } from "../../data";

export const CATEGORIES_QUERY_KEY = "categories";

export function useGetCategories() {
  return useQuery([CATEGORIES_QUERY_KEY], () => {
    return Category.find();
  });
}
