import * as React from 'react';

import BottomTabNavigator from './BottomTabNavigator';
import CreateMockData from '@/screens/CreateMockData';
import TestComponents from '@/screens/TestComponents';
import BudgetDetailsScreen from '@/screens/budget/BudgetDetails';
import BudgetFormScreen from '@/screens/budget/BudgetForm';
import CategoryForm from '@/screens/category/CategoryForm';
import CategoryList from '@/screens/category/CategoryList';
import TransactionFormScreen from '@/screens/transaction/TransactionForm';
import { useTheme } from '@/theme/ThemeContext';
import { RootStackParamList } from '@/types';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        defaultScreenOptions={{
          headerTitleAlign: 'left',
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
            animation: 'fade_from_bottom',
            animationDuration: 250,
            title: route.params?.category.id ? 'Editar Categoría' : 'Crear Categoría',
          })}
        />
        <Stack.Screen
          name="CategoryList"
          component={CategoryList}
          options={() => ({
            title: 'Categorías',
            animation: 'fade_from_bottom',
            animationDuration: 250,
          })}
        />
        {/* Transactions screens */}
        <Stack.Screen
          name="TransactionForm"
          component={TransactionFormScreen}
          options={({ route }) => ({
            animation: 'fade_from_bottom',
            animationDuration: 250,
            title: route.params?.transaction?.id ? 'Editar Transacctión' : 'Crear Transacctión',
          })}
        />
        {/* Budget screens */}
        <Stack.Screen
          name="BudgetForm"
          component={BudgetFormScreen}
          options={({ route }) => ({
            animation: route.params?.budget ? 'slide_from_right' : 'fade_from_bottom',
            animationDuration: 250,
            title: route.params?.budget ? 'Editar Presupuesto' : 'Crear Presupuesto',
          })}
        />
        <Stack.Screen
          name="BudgetDetails"
          component={BudgetDetailsScreen}
          options={() => ({
            title: 'Detalles de Presupuesto',
            animation: 'fade_from_bottom',
            animationDuration: 250,
          })}
        />
        {/* Other screens */}
        <Stack.Screen
          name="CreateMockData"
          component={CreateMockData}
          options={() => ({
            title: 'Crear datos de prueba',
            animation: 'slide_from_right',
            animationDuration: 250,
          })}
        />
        <Stack.Screen
          name="TestComponents"
          component={TestComponents}
          options={() => ({
            title: 'Test',
            animation: 'fade_from_bottom',
            animationDuration: 250,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
