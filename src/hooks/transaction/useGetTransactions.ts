import { useQuery } from 'react-query';
import { FindManyOptions, FindOptionsOrderProperty } from 'typeorm';

import { Transaction } from '@/data';

const DEFAULT_ORDER: FindOptionsOrderProperty<Transaction> = { date: 'DESC' };

export function useGetTransactions(opts?: FindManyOptions<Transaction>) {
  return useQuery(['transactions', opts], () => {
    return Transaction.find({
      order: DEFAULT_ORDER,
      ...opts,
    });
  });
}
