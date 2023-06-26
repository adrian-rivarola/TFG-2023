import { useMutation, useQueryClient } from 'react-query';

import { CATEGORIES_QUERY_KEY } from './useGetCategories';
import { Category } from '../../data';

export function useDeleteCategory() {
  const queryCache = useQueryClient();

  return useMutation((categoryId: number) => Category.delete(categoryId), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
