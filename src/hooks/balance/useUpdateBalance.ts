import { useMutation, useQueryClient } from 'react-query';

import { Balance } from '@/data';

export function useUpdateBalance() {
  const queryCache = useQueryClient();

  return useMutation((initialBalance: number) => Balance.setInitialBalance(initialBalance), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}
