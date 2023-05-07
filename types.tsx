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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  TransactionForm:
    | {
        transactionId: number;
      }
    | undefined;
  BudgetForm:
    | undefined
    | {
        budgetId: number;
      };
  CategorySelect:
    | {
        multiple: boolean;
      }
    | undefined;
  CategoryForm: undefined;
  TransactionDetails: {
    transactionId: number;
  };
  BudgetDetails: {
    budgetId: number;
  };
  ReportsScreen: undefined;
  TestComponents: undefined;
  Configuration: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type BottomTabParamList = {
  Home: undefined;
  TransactionList: undefined;
  BudgetList: undefined;
  Configuration: undefined;
  ReportsScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
