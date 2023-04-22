import { deleteAllBudgets } from "../services/budgetService";
import { deleteAllCategories } from "../services/categoryService";
import { deleteAllTransactions } from "../services/transactionsService";

export async function clearAllData() {
  try {
    await deleteAllBudgets();
    await deleteAllTransactions();
    await deleteAllCategories();
    return true;
  } catch (error) {
    console.log("Failed to clear all data", error);
    return false;
  }
}
