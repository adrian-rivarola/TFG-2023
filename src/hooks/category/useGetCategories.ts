import { useQuery } from 'react-query';

import { Category, CategoryType } from '@/data';

type CategoriesMap = Record<CategoryType, Category[]>;

export function useGetCategories() {
  return useQuery<CategoriesMap>(['categories'], () =>
    Category.find().then((categories) => ({
      [CategoryType.income]: categories?.filter((c) => c.isIncome) ?? [],
      [CategoryType.expense]: categories?.filter((c) => c.isExpense) ?? [],
    }))
  );
}
