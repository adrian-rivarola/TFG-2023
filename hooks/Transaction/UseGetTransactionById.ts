import { useQuery } from "react-query";
import { Transaction } from "../../data";
import { TRANSACTIONS_QUERY_KEY } from "./useGetTransactions";

async function getTransactionById(id: number) {
  return Transaction.findOneByOrFail({ id });
}

export function useGetTransactionById(transactionId: number) {
  return useQuery(
    [TRANSACTIONS_QUERY_KEY, transactionId],
    () => getTransactionById(transactionId),
    {
      enabled: !!transactionId,
    }
  );
}
