import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import CategorySelectScreen from "../screens/CategorySelectScreen";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import CategoryFormScreen from "../screens/CategoryFormScreen";
import TransactionFormScreen from "../screens/TransactionFormScreen";
import BudgetListScreen from "../screens/BudgetListScreen";
import HomeScreen from "../screens/HomeScreen";
import TransactionsListScreen from "../screens/TransactionsListScreen";
import { RootTabParamList } from "../types";
import BudgetFormScreen from "../screens/BudgetFormScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import BudgetDetailsScreen from "../screens/BudgetDetails";

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
      screenOptions={({ route }) => ({
        lazy: true,
        headerRight,
        tabBarButton: tabBarItems.includes(route.name) ? undefined : () => null,
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          unmountOnBlur: true,
          headerTitleAlign: "left",
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
          title: "Transactions",
          headerTitleAlign: "left",
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
          title: "Add Transaction",
          headerTitleAlign: "left",
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
          unmountOnBlur: true,
          title: "Budgets",
          headerTitleAlign: "left",
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
          title: "Configuration",
          headerTitleAlign: "left",
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
          title: "Select Category",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={({ navigation }) => ({
          title: "Create Category",
          unmountOnBlur: true,
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="BudgetForm"
        component={BudgetFormScreen}
        options={({ navigation, route }) => ({
          unmountOnBlur: !!route.params?.budgetId,
          title: route.params?.budgetId ? "Edit Budget" : "Add Budget",
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
          title: "Transaction Details",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="BudgetDetails"
        component={BudgetDetailsScreen}
        options={({ navigation }) => ({
          unmountOnBlur: true,
          title: "Budget details",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <BottomTab.Screen
        name="TransactionEditForm"
        component={TransactionFormScreen}
        getId={({ params }) => {
          console.log({ getIdFunc: params?.transactionId.toString() });

          return params?.transactionId.toString();
        }}
        options={({ navigation }) => ({
          title: "Edit Transaction",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
