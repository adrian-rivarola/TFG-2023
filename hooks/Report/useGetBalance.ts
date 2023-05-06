import { useQuery } from "react-query";
import { CategoryType, Transaction } from "../../data";

async function getBalance() {
  const expenseTotal = await Transaction.sum("amount", {
    category: {
      type: CategoryType.expense,
    },
  });
  const incomeTotal = await Transaction.sum("amount", {
    category: {
      type: CategoryType.income,
    },
  });

  return (incomeTotal || 0) - (expenseTotal || 0);
}

export const BALANCE_QUERY_KEY = "balance";

export function useGetBalance() {
  return useQuery([BALANCE_QUERY_KEY], getBalance);
}
