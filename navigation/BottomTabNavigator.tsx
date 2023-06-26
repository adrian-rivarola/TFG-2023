import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import ConfigurationScreen from '../screens/Configuration';
import Home from '../screens/Home';
import Reports from '../screens/Reports';
import BudgetListScreen from '../screens/budget/BudgetList';
import TransactionsListScreen from '../screens/transaction/TransactionsList';
import { BottomTabParamList } from '../types';

function TabBarIcon({ size, ...props }: React.ComponentProps<typeof MaterialIcons>) {
  return <MaterialIcons size={size || 30} style={{ marginBottom: -3 }} {...props} />;
}

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      backBehavior="initialRoute"
      initialRouteName="Home"
      screenOptions={() => ({
        lazy: true,
        headerTitleAlign: 'left',
        tabBarHideOnKeyboard: true,
      })}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TransactionList"
        component={TransactionsListScreen}
        options={{
          title: 'Transacciones',
          tabBarLabel: 'Transacciones',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="BudgetList"
        component={BudgetListScreen}
        options={{
          title: 'Presupuestos',
          tabBarIcon: ({ color }) => <TabBarIcon name="account-balance-wallet" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ReportsScreen"
        component={Reports}
        options={{
          title: 'Reportes',
          tabBarLabel: 'Reportes',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Configuration"
        component={ConfigurationScreen}
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
