import dayjs, { Dayjs } from 'dayjs';

import { StringDateRange, getGroupLabel } from './dateUtils';
import { Transaction } from '../data';

export function groupTransactionsByDate(
  transactions: Transaction[],
  groupRange: StringDateRange = 'day'
) {
  const transactionsMap = new Map<Dayjs, Transaction[]>();

  transactions.forEach((t) => {
    const date = dayjs(t.date).startOf(groupRange);
    const key = [...transactionsMap.keys()].find((k) => k.isSame(date, groupRange)) || date;
    transactionsMap.set(key, [...(transactionsMap.get(key) || []), t]);
  });

  const res: Record<string, Transaction[]> = {};
  transactionsMap.forEach((vals, key) => {
    const date = getGroupLabel(key, groupRange);
    res[date] = vals;
  });

  return res;
}
