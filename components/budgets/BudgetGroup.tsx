import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { Budget } from '../../data';
import BudgetCard from './BudgetCard';

type BudgetGroupProps = {
  title: string;
  budgets: Budget[];
};

export function BudgetGroup({ budgets, title }: BudgetGroupProps) {
  if (budgets.length === 0) {
    return null;
  }

  return (
    <View style={{ marginBottom: 15 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <Text variant="labelLarge">{title}</Text>
      </View>

      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </View>
  );
}
