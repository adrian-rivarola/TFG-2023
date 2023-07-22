import { useMutation, useQueryClient } from 'react-query';

import { Transaction } from '@/data';

export function useDeleteTransaction() {
  const queryCache = useQueryClient();

  return useMutation((transactionId: number) => Transaction.delete(transactionId), {
    onSuccess: () => {
      queryCache.resetQueries();
    },
  });
}
