import { useQuery } from 'react-query';

import { Budget } from '../../data';

export const BUDGETS_QUERY_KEY = 'budgets';

export function useGetBudgets() {
  return useQuery([BUDGETS_QUERY_KEY], () => {
    return Budget.find();
  });
}
