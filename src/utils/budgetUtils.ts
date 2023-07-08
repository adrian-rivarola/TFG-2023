import { getTotalsByDate } from './chartUtils';
import { Budget } from '@/data';
import { BUDGET_COLORS } from '@/theme/colors';

export function getBudgetStatusColor(percentage: number) {
  switch (true) {
    case percentage < 60:
      return BUDGET_COLORS.LOW;
    case percentage < 95:
      return BUDGET_COLORS.MEDIUM;
    default:
      return BUDGET_COLORS.HIGH;
  }
}

export function getBudgetTrend(budget: Budget) {
  const { transactions = [], dateRange } = budget;
  const dateOffset = dateRange === 'month' ? 'week' : 'day';
  const format = dateRange === 'week' ? 'ddd' : 'DD/MM';

  const data = getTotalsByDate(transactions, dateRange, dateOffset, format);

  let acc = 0;
  return {
    trend: Object.values(data).map((val) => (acc += val), acc),
    labels: Object.keys(data),
  };
}
