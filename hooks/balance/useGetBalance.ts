import { useQuery } from "react-query";
import { Balance } from "../../data";

async function getBalance() {
  const balance = await Balance.getTotalBalance();
  const totals = await Balance.getPartialTotals();

  return {
    balance,
    ...totals,
  };
}

export const BALANCE_QUERY_KEY = "balance";

export function useGetBalance() {
  return useQuery([BALANCE_QUERY_KEY], getBalance);
}
