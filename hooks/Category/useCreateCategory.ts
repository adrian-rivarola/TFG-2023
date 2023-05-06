import { useMutation, useQueryClient } from "react-query";
import { Category } from "../../data";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

export function useCreateCategory() {
  const queryCache = useQueryClient();

  return useMutation((category: Category) => Category.save(category), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
