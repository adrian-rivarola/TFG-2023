import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useQueryClient } from "react-query";
import { useTheme } from "../context/ThemeContext";
import { RootTabParamList } from "../types";

import ConfigurationScreen from "../screens/Configuration";
import Home from "../screens/Home";
import Reports from "../screens/Reports";

import BudgetDetailsScreen from "../screens/budget/BudgetDetails";
import BudgetFormScreen from "../screens/budget/BudgetForm";
import BudgetListScreen from "../screens/budget/BudgetList";

import CategoryForm from "../screens/category/CategoryForm";
import CategorySelect from "../screens/category/CategorySelect";

import TransactionDetailsScreen from "../screens/transaction/TransactionDetails";
import TransactionFormScreen from "../screens/transaction/TransactionForm";
import TransactionsListScreen from "../screens/transaction/TransactionsList";

import TestComponents from "../screens/TestComponents";

function TabBarIcon({
  size,
  ...props
}: React.ComponentProps<typeof MaterialIcons>) {
  return (
    <MaterialIcons size={size || 30} style={{ marginBottom: -3 }} {...props} />
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const queryClient = useQueryClient();
  const { isDarkTheme, toggleThemeType } = useTheme();

  const tabBarItems: Array<keyof RootTabParamList> = [
    "Home",
    "TransactionList",
    "TransactionForm",
    "BudgetList",
    "Configuration",
  ];

  const headerRight = () => (
    <Pressable
      style={{ marginEnd: 16 }}
      onPress={() => {
        // toggleThemeType();

        // List all active react-query caches
        const queryCache = queryClient.getQueryCache();
        const liveQueriesOnScreen = queryCache.findAll();
        const queryKeys = liveQueriesOnScreen.map((query) => query.queryKey);
        console.log(queryKeys.map((q) => JSON.stringify(q)).join("\n"));
      }}
    >
      <MaterialIcons
        size={24}
        color={isDarkTheme ? "white" : "black"}
        name={isDarkTheme ? "lightbulb" : "lightbulb-outline"}
      />
    </Pressable>
  );

  return (
    <BottomTab.Navigator
      backBehavior="history"
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        lazy: true,
        tabBarHideOnKeyboard: true,
        headerRight,
        tabBarButton: tabBarItems.includes(route.name) ? undefined : () => null,
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Inicio",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TransactionList"
        component={TransactionsListScreen}
        options={{
          title: "Transacciones",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compare-arrows" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TransactionForm"
        component={TransactionFormScreen}
        options={({ route }) => ({
          title: "Crear Transacción",
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="add" size={50} color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="BudgetList"
        component={BudgetListScreen}
        options={{
          title: "Presupuestos",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="attach-money" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Configuration"
        component={ConfigurationScreen}
        options={{
          title: "Ajustes",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
      {/* Don't show on bottom tab */}
      <BottomTab.Screen
        name="CategorySelect"
        component={CategorySelect}
        options={({ navigation }) => ({
          title: "Seleccionar Categoría",
          headerLeft: () =>
            navigation.canGoBack() && (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
        })}
      />
      <BottomTab.Screen
        name="CategoryForm"
        component={CategoryForm}
        options={({ navigation }) => ({
          title: "Crear Categoría",
          unmountOnBlur: true,
          headerLeft: () =>
            navigation.canGoBack() && (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
        })}
      />
      <BottomTab.Screen
        name="BudgetForm"
        component={BudgetFormScreen}
        options={({ navigation, route }) => ({
          unmountOnBlur: !!route.params?.budgetId,
          title: route.params?.budgetId
            ? "Editar Presupuesto"
            : "Crear Presupuesto",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={({ navigation }) => ({
          unmountOnBlur: true,
          title: "Detalles de Transacción",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="BudgetDetails"
        component={BudgetDetailsScreen}
        options={({ navigation }) => ({
          title: "Detalles de Presupuesto",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="TransactionEditForm"
        component={TransactionFormScreen}
        getId={({ params }) => params?.transactionId?.toString()}
        options={({ navigation }) => ({
          title: "Editar Transacción",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="ReportsScreen"
        component={Reports}
        options={({ navigation }) => ({
          title: "Reportes",
          unmountOnBlur: true,
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="TestComponents"
        component={TestComponents}
        options={({ navigation }) => ({
          title: "Test",
          unmountOnBlur: true,
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
