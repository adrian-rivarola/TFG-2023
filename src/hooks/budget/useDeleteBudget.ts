import { useMutation, useQueryClient } from 'react-query';

import { Budget } from '@/data';

export function useDeleteBudget() {
  const queryCache = useQueryClient();

  return useMutation((budgetId: number) => Budget.delete(budgetId), {
    onSuccess: () => {
      queryCache.invalidateQueries();
    },
  });
}
