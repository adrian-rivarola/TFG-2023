import { useQuery } from 'react-query';

import { Budget } from '@/data';

export function useGetBudgets() {
  return useQuery(['budgets'], () => {
    return Budget.find();
  });
}
