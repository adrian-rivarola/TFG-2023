/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BudgetFormData, CategoryType, TransactionFormData } from "./data";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  TransactionForm:
    | {
        transaction?: TransactionFormData;
      }
    | undefined;
  BudgetForm:
    | undefined
    | {
        budget: BudgetFormData;
      };
  CategoryList: {
    action: "select" | "select-multiple" | "edit";
    categoryType?: CategoryType;
    initialTab?: CategoryType;
  };
  CategoryForm:
    | undefined
    | {
        id: number;
        name: string;
        icon: string;
        type: CategoryType;
      };
  BudgetDetails: {
    budgetId: number;
  };
  TestComponents: undefined;
  Configuration: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type BottomTabParamList = {
  Home: undefined;
  TransactionList: undefined;
  BudgetList: undefined;
  ReportsScreen: undefined;
  Configuration: undefined;
};

export type RootTabScreenProps<Screen extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
