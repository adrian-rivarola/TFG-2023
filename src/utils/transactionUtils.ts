import dayjs, { Dayjs } from 'dayjs';

import { Transaction } from '@/data';
import { StringDateRange } from '@/types';

export function groupTransactionsByDate(
  transactions: Transaction[],
  groupRange: StringDateRange = 'day'
) {
  const transactionsMap = new Map<Dayjs, Transaction[]>();

  transactions.forEach((transaction) => {
    const key =
      [...transactionsMap.keys()].find((k) => k.isSame(transaction.date, groupRange)) ||
      dayjs(transaction.date).startOf(groupRange);

    transactionsMap.set(key, [...(transactionsMap.get(key) || []), transaction]);
  });

  return transactionsMap;
}
