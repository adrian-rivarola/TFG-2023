import { useMutation, useQueryClient } from "react-query";
import { Balance } from "../../data";
import { BALANCE_QUERY_KEY } from "./useGetBalance";

export function useUpdateBalance() {
  const queryCache = useQueryClient();

  return useMutation(
    (initialBalance: number) => Balance.setInitialBalance(initialBalance),
    {
      onSuccess: () => {
        queryCache.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });
      },
    }
  );
}
