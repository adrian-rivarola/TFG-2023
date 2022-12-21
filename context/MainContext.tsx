import React, { Reducer, useContext, useEffect, useReducer } from "react";
import BudgetService, { BudgetStatus } from "../data/classes/Budget";
import CategoryService, { Category } from "../data/classes/Category";
import { Transaction } from "../data/classes/Transaction";

interface MainContextValue {
  balance: number;
  allBudgets: BudgetStatus[];
  activeBudgets: BudgetStatus[];
  inactiveBudgets: BudgetStatus[];
  transactions: Transaction[];
  categories: Category[];
  selectedCategory?: Category;
  setBalance(balance: number): void;
  selectCategory(category: Category): void;
  setBudgets(budgets: BudgetStatus[]): void;
  setCategories(categories: Category[]): void;
  setTransactions(transactions: Transaction[]): void;
}

const initialValue: MainContextValue = {
  balance: 0,
  allBudgets: [],
  activeBudgets: [],
  inactiveBudgets: [],
  transactions: [],
  categories: [],
  setBalance() {},
  setBudgets() {},
  setCategories() {},
  selectCategory() {},
  setTransactions() {},
};

export const MainContext = React.createContext(initialValue);

export const useMainContext = () => useContext(MainContext);

type ActionType =
  | { type: "set-balance"; payload: number }
  | { type: "set-budgets"; payload: BudgetStatus[] }
  | { type: "set-transactions"; payload: Transaction[] }
  | { type: "select-category"; payload: Category }
  | { type: "set-categories"; payload: Category[] };

const mainReducer: Reducer<MainContextValue, ActionType> = (state, action) => {
  switch (action.type) {
    case "set-balance":
      return {
        ...state,
        balance: action.payload,
      };
    case "set-budgets":
      return {
        ...state,
        allBudgets: action.payload,
        activeBudgets: action.payload.filter((budget) => budget.is_active),
        inactiveBudgets: action.payload.filter((budget) => !budget.is_active),
      };
    case "set-transactions":
      return {
        ...state,
        transactions: action.payload,
      };
    case "set-categories":
      return {
        ...state,
        categories: action.payload,
      };
    case "select-category":
      return {
        ...state,
        selectedCategory: action.payload,
      };
  }
};

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(mainReducer, initialValue);

  useEffect(() => {
    const categoryService = new CategoryService();
    const budgetService = new BudgetService();

    budgetService.query().then(async (budgetList) => {
      const budgets = await Promise.all(
        budgetList.map((b) => budgetService.addStatusToBudget(b))
      );
      setBudgets(budgets);
    });
    categoryService.query({}).then(setCategories);
  }, []);

  const setBalance = (balance: number) => {
    dispatch({ type: "set-balance", payload: balance });
  };

  const setBudgets = (budgets: BudgetStatus[]) => {
    dispatch({ type: "set-budgets", payload: budgets });
  };

  const setTransactions = (transactions: Transaction[]) => {
    dispatch({ type: "set-transactions", payload: transactions });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: "set-categories", payload: categories });
  };

  const selectCategory = (category: Category) => {
    dispatch({
      type: "select-category",
      payload: category,
    });
  };

  return (
    <MainContext.Provider
      value={{
        ...state,
        setTransactions,
        setBudgets,
        setCategories,
        selectCategory,
        setBalance,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
