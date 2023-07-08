import { useInfiniteQuery } from 'react-query';
import { FindOptionsWhere } from 'typeorm';

import { Transaction } from '@/data';

const PER_PAGE = 20;

function fetchTransactionPage(pageParam: number, where?: FindOptionsWhere<Transaction>) {
  return Transaction.find({
    where,
    order: {
      date: 'DESC',
    },
    take: PER_PAGE,
    skip: PER_PAGE * pageParam,
  });
}

export function useGetInfiniteTransactions(filters: FindOptionsWhere<Transaction> = {}) {
  return useInfiniteQuery({
    queryKey: ['transactions', filters],
    queryFn: ({ pageParam = 0 }) => fetchTransactionPage(pageParam, filters),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PER_PAGE ? allPages.length : undefined,
  });
}
