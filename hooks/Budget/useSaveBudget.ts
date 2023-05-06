import { useMutation, useQueryClient } from "react-query";
import { Budget } from "../../data";
import { TRANSACTIONS_QUERY_KEY } from "../transaction/useGetTransactions";
import { BUDGETS_QUERY_KEY } from "./useGetBudgets";

export function useSaveBudget() {
  const queryClient = useQueryClient();

  return useMutation((budget: Budget) => Budget.save(budget), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [BUDGETS_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_QUERY_KEY],
      });
    },
  });
}
