import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { RootTabParamList } from "../types";

import ConfigurationScreen from "../screens/ConfigurationScreen";
import HomeScreen from "../screens/HomeScreen";
import ReportsScreen from "../screens/ReportsScreen";

import BudgetDetailsScreen from "../screens/BudgetDetailsScreen";
import BudgetFormScreen from "../screens/BudgetFormScreen";
import BudgetListScreen from "../screens/BudgetListScreen";

import CategoryFormScreen from "../screens/CategoryFormScreen";
import CategorySelectScreen from "../screens/CategorySelectScreen";

import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import TransactionFormScreen from "../screens/TransactionFormScreen";
import TransactionsListScreen from "../screens/TransactionsListScreen";

type TabBarIconProps = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
  size?: number;
};

function TabBarIcon({ size, ...props }: TabBarIconProps) {
  return (
    <MaterialIcons size={size || 30} style={{ marginBottom: -3 }} {...props} />
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const { isDarkTheme, toggleThemeType } = useTheme();

  const tabBarItems: Array<keyof RootTabParamList> = [
    "Home",
    "TransactionList",
    "TransactionForm",
    "BudgetList",
    "Configuration",
  ];

  const headerRight = () => (
    <Pressable onPress={toggleThemeType} style={{ marginEnd: 16 }}>
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
        component={HomeScreen}
        options={{
          title: "Inicio",
          unmountOnBlur: true,
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
        component={CategorySelectScreen}
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
        component={CategoryFormScreen}
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
          unmountOnBlur: true,
          title: "Detalles de Presupuesto",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="TransactionEditForm"
        component={TransactionFormScreen}
        getId={({ params }) => params?.transactionId.toString()}
        options={({ navigation }) => ({
          title: "Editar Transacción",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={({ navigation }) => ({
          title: "Reportes",
          unmountOnBlur: true,
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
