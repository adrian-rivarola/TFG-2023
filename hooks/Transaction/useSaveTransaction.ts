import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "../../data";

export function useSaveTransaction() {
  const queryCache = useQueryClient();

  return useMutation(
    (transaction: Transaction) => Transaction.save(transaction),
    {
      onSuccess: () => {
        queryCache.resetQueries();
      },
    }
  );
}
