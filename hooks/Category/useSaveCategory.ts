import { useMutation, useQueryClient } from "react-query";
import { Category } from "../../data";
import { CATEGORIES_QUERY_KEY } from "./useGetCategories";

export function useSaveCategory() {
  const queryCache = useQueryClient();

  const onSuccess = () => {
    queryCache.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
  };

  return useMutation((category: Category) => Category.save(category), {
    onSuccess,
  });
}
