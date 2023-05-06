import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "../../data";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";
import { BUDGETS_QUERY_KEY } from "../budget/useGetBudgets";

export function useDeleteTransaction() {
  const queryCache = useQueryClient();

  return useMutation(
    (transactionId: number) => Transaction.delete(transactionId),
    {
      onSuccess: () => {
        queryCache.invalidateQueries({
          queryKey: [BUDGETS_QUERY_KEY],
        });
        queryCache.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY],
        });
      },
    }
  );
}
