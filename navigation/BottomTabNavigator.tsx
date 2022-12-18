import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Pressable } from "react-native";
import { useTheme } from "../context/ThemeContext";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import CreateScreen from "../screens/CreateScreen";
import PlanningScreen from "../screens/PlanningScreen";
import TestComponents from "../screens/TestComponents";
import TransactionsScreen from "../screens/TransactionsScreen";
import { RootTabParamList } from "../types";

type TabBarIconProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  size?: number;
};

function TabBarIcon({ size, ...props }: TabBarIconProps) {
  return (
    <MaterialCommunityIcons
      size={size || 30}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const { isDarkTheme, toggleThemeType } = useTheme();

  const headerRight = () => (
    <Pressable onPress={toggleThemeType} style={{ marginEnd: 16 }}>
      <MaterialCommunityIcons
        size={24}
        color={isDarkTheme ? "white" : "black"}
        name={isDarkTheme ? "lightbulb" : "moon-waxing-crescent"}
      />
    </Pressable>
  );

  return (
    <BottomTab.Navigator
      initialRouteName="TestComponents"
      screenOptions={{ headerRight }}
    >
      <BottomTab.Screen
        name="TestComponents"
        component={TestComponents}
        options={{
          title: "Home",
          headerTitleAlign: "left",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: "Transactions",
          headerTitleAlign: "left",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="wallet-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: "Add Transaction",
          headerTitleAlign: "left",
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="plus" size={50} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Planning"
        component={PlanningScreen}
        options={{
          title: "Planning",
          headerTitleAlign: "left",
          headerTitleContainerStyle: {
            paddingVertical: 8,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="graphql" color={color} />
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
            <TabBarIcon name="account-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
