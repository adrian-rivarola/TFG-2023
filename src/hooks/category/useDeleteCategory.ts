import { useMutation, useQueryClient } from 'react-query';

import { Category } from '@/data';

export function useDeleteCategory() {
  const queryCache = useQueryClient();

  return useMutation((categoryId: number) => Category.delete(categoryId), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
