/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import ConfirmationModal from "../components/ConfirmationModal";
import SnackbarMessage from "../components/SnackbarMessage";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <ConfirmationModal />
      <SnackbarMessage />
    </NavigationContainer>
  );
}
