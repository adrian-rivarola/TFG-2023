import { useQuery } from 'react-query';

import { Budget } from '@/data';

async function getBudgetById(budgetId: number) {
  const budget = await Budget.findOneByOrFail({
    id: budgetId,
  });
  budget.transactions = await Budget.findTransactions(budget);
  budget.previousPeriods = await Budget.getPreviousPeriods(budget, 6);

  return budget;
}

export function useGetBudgetsById(budgetId: number) {
  return useQuery(
    ['budgets', budgetId],
    () => {
      return getBudgetById(budgetId);
    },
    {
      enabled: !!budgetId,
    }
  );
}
