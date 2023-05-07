import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { BottomTabParamList } from "../types";

import ConfigurationScreen from "../screens/Configuration";
import Home from "../screens/Home";
import BudgetListScreen from "../screens/budget/BudgetList";
import TransactionsListScreen from "../screens/transaction/TransactionsList";

function TabBarIcon({
  size,
  ...props
}: React.ComponentProps<typeof MaterialIcons>) {
  return (
    <MaterialIcons size={size || 30} style={{ marginBottom: -3 }} {...props} />
  );
}

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      backBehavior="initialRoute"
      initialRouteName="Home"
      screenOptions={() => ({
        lazy: true,
        headerTitleAlign: "left",
        tabBarHideOnKeyboard: true,
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TransactionList"
        component={TransactionsListScreen}
        options={{
          title: "Transacciones",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compare-arrows" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="BudgetList"
        component={BudgetListScreen}
        options={{
          title: "Presupuestos",
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
