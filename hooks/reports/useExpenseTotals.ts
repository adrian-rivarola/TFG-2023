import { useQuery } from 'react-query';

import { Transaction } from '../../data';
import { getTotalsByDate } from '../../utils/chartUtils';
import { StringDateRange, getDatesFromRange } from '../../utils/dateUtils';

export const REPORTS_QUERY_KEY = 'expenses';

async function getExpenseTotals(range: StringDateRange) {
  const dateRange = getDatesFromRange(range);
  const dailyTotals = await Transaction.getDailyTotals(dateRange);

  const format = range === 'week' ? 'ddd' : 'DD/MM';
  const dateOffset = range === 'month' ? 'week' : 'day';
  const totals = getTotalsByDate(dailyTotals, range, dateOffset, format);

  return {
    data: Object.values(totals),
    labels: Object.keys(totals),
  };
}

export function useExpenseTotals(range: StringDateRange) {
  return useQuery([REPORTS_QUERY_KEY, range], () => getExpenseTotals(range));
}
