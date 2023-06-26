import { useQuery } from 'react-query';
import { FindManyOptions, FindOptionsOrderProperty } from 'typeorm';

import { Transaction } from '../../data';

export const TRANSACTIONS_QUERY_KEY = 'transactions';

const DEFAULT_ORDER: FindOptionsOrderProperty<Transaction> = { date: 'DESC' };

export function useGetTransactions(opts?: FindManyOptions<Transaction>) {
  return useQuery([TRANSACTIONS_QUERY_KEY, opts], () => {
    return Transaction.find({
      order: DEFAULT_ORDER,
      ...opts,
    });
  });
}
