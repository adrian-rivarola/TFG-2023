import { useQuery } from 'react-query';
import { FindManyOptions, FindOptionsOrder } from 'typeorm';

import { Transaction } from '@/data';

const DEFAULT_ORDER: FindOptionsOrder<Transaction> = { date: 'DESC' };

export function useGetTransactions(filterOpts?: FindManyOptions<Transaction>, enabled?: boolean) {
  return useQuery(
    ['transactions', filterOpts],
    () => {
      return Transaction.find({
        order: DEFAULT_ORDER,
        ...filterOpts,
      });
    },
    { enabled }
  );
}
