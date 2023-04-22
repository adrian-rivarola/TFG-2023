import { LessThanOrEqual, MoreThan } from "typeorm";
import { Budget, dataSource } from "../data";

const budgetRepository = dataSource.getRepository(Budget);

export const getBudgets = async () => {
  const budgets = await budgetRepository.find();
  return budgets;
};

export const getBudgetById = async (budgetId: number) => {
  return budgetRepository.findOne({
    where: { id: budgetId },
  });
};

export const getBudgetsForTransaction = async (
  categoryId: number,
  date: Date
) => {
  return budgetRepository.find({
    where: {
      category: {
        id: categoryId,
      },
      isActive: true,
      startDate: LessThanOrEqual(date),
      endDate: MoreThan(date),
    },
  });
};

export const createBudget = async (budget: Budget) => {
  return budgetRepository.save(budget);
};

export const updateBudget = async (
  budgetId: number,
  payload: Partial<Budget>
) => {
  const result = await budgetRepository.update({ id: budgetId }, payload);
  return !!result.affected;
};

export const deleteBudget = async (budgetId: number) => {
  const result = await budgetRepository.delete({ id: budgetId });
  return !!result.affected;
};

export const deleteAllBudgets = async () => {
  await budgetRepository.clear();
};
