import React, { Reducer, useContext, useEffect, useReducer } from "react";
import BudgetService from "../data/classes/Budget";
import CategoryService from "../data/classes/Category";
import { Transaction } from "../data/classes/Transaction";
import dataSource from "../data/data-source";
import { Category } from "../data/entities/Category";
import { Budget } from "../data/entities/Budget";

interface MainContextValue {
  balance: number;
  allBudgets: Budget[];
  activeBudgets: Budget[];
  inactiveBudgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
  selectedCategory?: Category;
  setBalance(balance: number): void;
  selectCategory(category?: Category): void;
  setBudgets(budgets: Budget[]): void;
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
  | { type: "set-budgets"; payload: Budget[] }
  | { type: "set-transactions"; payload: Transaction[] }
  | { type: "select-category"; payload: Category | undefined }
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
        activeBudgets: action.payload.filter((budget) => budget.isActive),
        inactiveBudgets: action.payload.filter((budget) => !budget.isActive),
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
    // get categories
    const categoryRepository = dataSource.getRepository(Category);
    categoryRepository.find().then(setCategories);

    // get budgets
    const budgetRepository = dataSource.getRepository(Budget);
    budgetRepository.find({ relations: ["category"] }).then(setBudgets);
  }, []);

  const setBalance = (balance: number) => {
    dispatch({ type: "set-balance", payload: balance });
  };

  const setBudgets = (budgets: Budget[]) => {
    dispatch({ type: "set-budgets", payload: budgets });
  };

  const setTransactions = (transactions: Transaction[]) => {
    dispatch({ type: "set-transactions", payload: transactions });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: "set-categories", payload: categories });
  };

  const selectCategory = (category?: Category) => {
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
