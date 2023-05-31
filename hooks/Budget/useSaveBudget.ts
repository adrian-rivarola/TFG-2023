import { useMutation, useQueryClient } from "react-query";
import { Budget } from "../../data";

export function useSaveBudget() {
  const queryClient = useQueryClient();

  return useMutation((budget: Budget) => Budget.save(budget), {
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}
