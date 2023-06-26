import { useMutation, useQueryClient } from 'react-query';

import { BALANCE_QUERY_KEY } from './useGetBalance';
import { Balance } from '../../data';

export function useUpdateBalance() {
  const queryCache = useQueryClient();

  return useMutation((initialBalance: number) => Balance.setInitialBalance(initialBalance), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });
    },
  });
}
