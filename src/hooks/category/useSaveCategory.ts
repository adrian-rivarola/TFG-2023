import { useMutation, useQueryClient } from 'react-query';

import { Category } from '@/data';

export function useSaveCategory() {
  const queryCache = useQueryClient();

  const onSuccess = () => {
    queryCache.invalidateQueries({ queryKey: ['categories'] });
  };

  return useMutation((category: Category) => Category.save(category), {
    onSuccess,
  });
}
