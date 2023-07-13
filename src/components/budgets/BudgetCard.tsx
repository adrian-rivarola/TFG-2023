import React from 'react';
import { View } from 'react-native';
import { Badge, Card, Text } from 'react-native-paper';

import BudgetProgressBar from './BudgetProgressBar';
import { Budget } from '@/data';
import { BUDGET_COLORS } from '@/theme/colors';
import { useNavigation } from '@react-navigation/native';

type BudgetCardProps = {
  budget: Budget;
};

export default function BudgetCard({ budget }: BudgetCardProps) {
  const navigation = useNavigation();
  const { totalSpent, maxAmount } = budget;

  return (
    <Card
      elevation={1}
      style={{
        marginBottom: 15,
        padding: 10,
      }}
      onPress={() => {
        navigation.navigate('BudgetDetails', {
          budgetId: budget.id,
        });
      }}
    >
      <Badge
        style={{
          top: -15,
          right: -15,
          position: 'absolute',
          backgroundColor: BUDGET_COLORS.HIGH,
        }}
        visible={totalSpent >= maxAmount}
        size={15}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <Text variant="labelLarge">{budget.description}</Text>
          </View>

          <BudgetProgressBar {...budget} />
        </View>
      </View>
    </Card>
  );
}
