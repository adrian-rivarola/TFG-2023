import React, { Reducer, useContext, useEffect, useReducer } from "react";
import BudgetService, { BudgetStatus } from "../data/classes/Budget";
import CategoryService, { Category } from "../data/classes/Category";
import ReportService from "../data/classes/Report";
import { Transaction } from "../data/classes/Transaction";

interface MainContextValue {
  balance: number;
  allBudgets: BudgetStatus[];
  activeBudgets: BudgetStatus[];
  inactiveBudgets: BudgetStatus[];
  transactions: Transaction[];
  categories: Category[];
  selectedCategory?: Category;
  setBudgets(budgets: BudgetStatus[]): void;
  setTransactions(transactions: Transaction[]): void;
  setCategories(categories: Category[]): void;
  selectCategory(category: Category): void;
}

const initialValue: MainContextValue = {
  balance: 0,
  allBudgets: [],
  activeBudgets: [],
  inactiveBudgets: [],
  transactions: [],
  categories: [],
  setTransactions() {},
  setCategories() {},
  setBudgets() {},
  selectCategory() {},
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
    const reportService = new ReportService();
    const budgetService = new BudgetService();

    budgetService.query().then(async (budgetList) => {
      const budgets = await Promise.all(
        budgetList.map((b) => budgetService.addStatusToBudget(b))
      );
      setBudgets(budgets);
    });

    categoryService.query({}).then(setCategories);
    reportService.getData().then(() => {
      setBalance(reportService.balance);
    });
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
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
