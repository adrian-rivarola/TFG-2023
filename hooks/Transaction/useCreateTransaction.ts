import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "../../data";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";
import { BALANCE_QUERY_KEY } from "../Report/useGetBalance";
import { BUDGETS_QUERY_KEY } from "../Budget/useGetBudgets";
import { REPORTS_QUERY_KEY } from "../Report/useWeekTotals";

export function useCreateTransaction() {
  const queryCache = useQueryClient();

  return useMutation(
    (transaction: Transaction) => Transaction.save(transaction),
    {
      onSuccess: () => {
        queryCache.invalidateQueries({
          queryKey: [BUDGETS_QUERY_KEY],
        });
        queryCache.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY],
        });
        queryCache.invalidateQueries({
          queryKey: [BALANCE_QUERY_KEY],
        });
        queryCache.invalidateQueries({
          queryKey: [REPORTS_QUERY_KEY],
        });
      },
    }
  );
}
