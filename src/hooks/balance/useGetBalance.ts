import { useQuery } from 'react-query';

import { Balance } from '@/data';
import { getDatesFromRange } from '@/utils/dateUtils';

async function getBalance() {
  const balance = await Balance.getTotalBalance();
  const totals = await Balance.getPartialBalance(getDatesFromRange('month'));

  return {
    balance,
    ...totals,
  };
}

export function useGetBalance() {
  return useQuery(['balance'], getBalance);
}
