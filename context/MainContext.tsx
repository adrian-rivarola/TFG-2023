import React, { Reducer, useContext, useEffect, useReducer } from "react";
import CategoryService, { Category } from "../data/classes/Category";
import ReportService from "../data/classes/Report";
import TransactionService, { Transaction } from "../data/classes/Transaction";

interface MainContextValue {
  balance: number;
  transactions: Transaction[];
  categories: Category[];
  setTransactions(transactions: Transaction[]): void;
  setCategories(categories: Category[]): void;
}

const initialValue: MainContextValue = {
  balance: 0,
  transactions: [],
  categories: [],
  setTransactions() {},
  setCategories() {},
};

export const MainContext = React.createContext(initialValue);

export const useMainContext = () => useContext(MainContext);

type ActionType =
  | { type: "set-balance"; payload: number }
  | { type: "set-transactions"; payload: Transaction[] }
  | { type: "set-categories"; payload: Category[] };

const mainReducer: Reducer<MainContextValue, ActionType> = (state, action) => {
  switch (action.type) {
    case "set-balance":
      return {
        ...state,
        balance: action.payload,
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
    categoryService.query({}).then(setCategories);

    const reportService = new ReportService();
    reportService.getData().then(() => {
      setBalance(reportService.balance);
    });

    // const transactionService = new TransactionService();
    // transactionService.getBalance().then(setBalance);
  }, []);

  const setBalance = (balance: number) => {
    dispatch({ type: "set-balance", payload: balance });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: "set-categories", payload: categories });
  };

  const setTransactions = (transactions: Transaction[]) => {
    dispatch({ type: "set-transactions", payload: transactions });
  };

  return (
    <MainContext.Provider value={{ ...state, setCategories, setTransactions }}>
      {children}
    </MainContext.Provider>
  );
};
