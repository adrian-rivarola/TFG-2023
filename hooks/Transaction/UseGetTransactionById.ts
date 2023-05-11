import { useQuery } from "react-query";
import { Budget, Transaction } from "../../data";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";

async function getTransactionById(transactionId: number) {
  const transaction = await Transaction.findOneByOrFail({
    id: transactionId,
  });

  transaction.budgets = await Budget.findBudgetsForTransaction(transaction);

  return transaction;
}

export function useGetTransactionById(transactionId: number) {
  return useQuery(
    [TRANSACTIONS_QUERY_KEY, transactionId],
    () => {
      return getTransactionById(transactionId);
    },
    {
      enabled: !!transactionId,
    }
  );
}
