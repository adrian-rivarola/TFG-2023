import { useMutation, useQueryClient } from "react-query";
import { Budget } from "../../data";
import { BUDGETS_QUERY_KEY } from "./useGetBudgets";
import { TRANSACTIONS_QUERY_KEY } from "../Transaction/useGetTransactions";

export function useDeleteBudget() {
  const queryCache = useQueryClient();

  return useMutation((budgetId: number) => Budget.delete(budgetId), {
    onSuccess: () => {
      queryCache.invalidateQueries({ queryKey: [BUDGETS_QUERY_KEY] });
      queryCache.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
    },
  });
}
