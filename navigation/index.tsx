import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../types";

import TestComponents from "../screens/TestComponents";
import BudgetDetailsScreen from "../screens/budget/BudgetDetails";
import BudgetFormScreen from "../screens/budget/BudgetForm";
import CategoryForm from "../screens/category/CategoryForm";
import CategoryList from "../screens/category/CategoryList";
import CategorySelect from "../screens/category/CategorySelect";
import TransactionDetailsScreen from "../screens/transaction/TransactionDetails";
import TransactionFormScreen from "../screens/transaction/TransactionForm";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        defaultScreenOptions={{
          headerTitleAlign: "left",
        }}
      >
        <Stack.Screen
          name="BottomTab"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        {/* Category screens */}
        <Stack.Screen
          name="CategoryForm"
          component={CategoryForm}
          options={({ route }) => ({
            animation: "fade_from_bottom",
            animationDuration: 250,
            title: route.params?.id ? "Editar Categoría" : "Crear Categoría",
          })}
        />
        <Stack.Screen
          name="CategorySelect"
          component={CategorySelect}
          options={() => ({
            title: "Seleccionar Categoría",
            animation: "fade_from_bottom",
            animationDuration: 250,
          })}
        />
        {/* Transactions screens */}
        <Stack.Screen
          name="TransactionForm"
          component={TransactionFormScreen}
          getId={({ params }) => params?.transactionId?.toString()}
          options={({ route }) => ({
            animation: "fade_from_bottom",
            animationDuration: 250,
            title: route.params?.transactionId
              ? "Editar Transacctión"
              : "Crear Transacctión",
          })}
        />
        <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
          options={() => ({
            title: "Detalles de Transacción",
          })}
        />
        {/* Budget screens */}
        <Stack.Screen
          name="BudgetForm"
          component={BudgetFormScreen}
          options={({ route }) => ({
            animation: "fade_from_bottom",
            animationDuration: 250,
            title: route.params?.budgetId
              ? "Editar Presupuesto"
              : "Crear Presupuesto",
          })}
        />
        <Stack.Screen
          name="BudgetDetails"
          component={BudgetDetailsScreen}
          options={() => ({
            title: "Detalles de Presupuesto",
          })}
        />
        {/* Other screens */}
        <Stack.Screen
          name="TestComponents"
          component={TestComponents}
          options={() => ({
            title: "Test",
          })}
        />
        <Stack.Screen
          name="CategoryList"
          component={CategoryList}
          options={() => ({
            title: "Categories",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
