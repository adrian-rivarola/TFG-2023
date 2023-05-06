import { useQuery } from "react-query";
import { Budget } from "../../data";
import { BUDGETS_QUERY_KEY } from "./useGetBudgets";

async function getBudgetById(budgetId: number) {
  const budget = await Budget.findOneByOrFail({
    id: budgetId,
  });
  budget.transactions = await Budget.findTransactions(budget);

  return budget;
}

export function useGetBudgetsById(budgetId: number) {
  return useQuery(
    [BUDGETS_QUERY_KEY, budgetId],
    () => {
      return getBudgetById(budgetId);
    },
    {
      enabled: !!budgetId,
    }
  );
}
