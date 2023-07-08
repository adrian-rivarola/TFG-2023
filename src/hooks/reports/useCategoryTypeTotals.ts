import { useQuery } from 'react-query';

import { CategoryTotal, CategoryType, Transaction } from '@/data';
import { CHART_COLORS } from '@/theme/colors';
import { DateRange } from '@/types';

type CategotyChartData = CategoryTotal & {
  color: string;
  percentage: number;
};

async function getCategoryTypeTotals(
  categoryType: CategoryType,
  dateRange?: DateRange
): Promise<CategotyChartData[]> {
  const categoryTotals = await Transaction.getTotalSpentAndCount(categoryType, dateRange);
  const allCategoriesTotal = categoryTotals.reduce((acc, val) => acc + val.total, 0);

  return categoryTotals.map((cat, idx) => {
    return {
      ...cat,
      percentage: cat.total / allCategoriesTotal,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    };
  });
}

export function useCategoryTypeTotals(categoryType: CategoryType, dateRange?: DateRange) {
  return useQuery(['categoryTotals', { dateRange, categoryType }], () =>
    getCategoryTypeTotals(categoryType, dateRange)
  );
}
