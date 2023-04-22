import React, { Reducer, useContext, useEffect, useReducer } from "react";

import { Budget, Category, Transaction } from "../data";
import * as budgetService from "../services/budgetService";
import * as categoryService from "../services/categoryService";
import * as reportService from "../services/reportService";

interface MainContextValue {
  balance: number;
  allBudgets: Budget[];
  activeBudgets: Budget[];
  inactiveBudgets: Budget[];
  categories: Category[];
  selectedCategory?: Category;
  setBalance(balance: number): void;
  selectCategory(category?: Category): void;
  setBudgets(budgets: Budget[]): void;
  setCategories(categories: Category[]): void;
  resetState(): void;
}

const initialValue: MainContextValue = {
  balance: 0,
  allBudgets: [],
  activeBudgets: [],
  inactiveBudgets: [],
  categories: [],
  resetState() {},
  setBalance() {},
  setBudgets() {},
  setCategories() {},
  selectCategory() {},
};

export const MainContext = React.createContext(initialValue);

export const useMainContext = () => useContext(MainContext);

type ActionType =
  | { type: "reset-state" }
  | { type: "set-balance"; payload: number }
  | { type: "set-budgets"; payload: Budget[] }
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
    case "reset-state":
      return {
        ...state,
        balance: 0,
        allBudgets: [],
        activeBudgets: [],
        inactiveBudgets: [],
        transactions: [],
        categories: [],
        selectedCategory: undefined,
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
    categoryService.getCategories().then(setCategories);
    budgetService.getBudgets().then(setBudgets);
    reportService.getBalance().then(setBalance);
  }, []);

  const setBalance = (balance: number) => {
    dispatch({ type: "set-balance", payload: balance });
  };

  const setBudgets = (budgets: Budget[]) => {
    dispatch({ type: "set-budgets", payload: budgets });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: "set-categories", payload: categories });
  };

  const resetState = () => {
    dispatch({ type: "reset-state" });
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
        setBudgets,
        setCategories,
        selectCategory,
        setBalance,
        resetState,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
