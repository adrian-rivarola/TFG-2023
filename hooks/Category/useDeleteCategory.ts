import { useMutation, useQueryClient } from "react-query";
import { Category } from "../../data";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

export function useDeleteCategory() {
  const queryCache = useQueryClient();

  return useMutation((categoryId: number) => Category.delete(categoryId), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
