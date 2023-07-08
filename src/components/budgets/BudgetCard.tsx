import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge, Card, Text } from 'react-native-paper';

import BudgetProgressBar from './BudgetProgressBar';
import { Budget } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { BUDGET_COLORS } from '@/theme/colors';
import { useNavigation } from '@react-navigation/native';

type BudgetCardProps = {
  budget: Budget;
};

export default function BudgetCard({ budget }: BudgetCardProps) {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation();

  const themedStyles = StyleSheet.create({
    surfaceStyle: {
      backgroundColor: colors.background,
      marginBottom: 15,
      padding: 10,
    },
  });

  return (
    <Card elevation={1} style={themedStyles.surfaceStyle}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BudgetDetails', {
            budgetId: budget.id,
          });
        }}
      >
        <Badge
          style={{
            position: 'absolute',
            right: -15,
            top: -15,
            backgroundColor: BUDGET_COLORS.HIGH,
          }}
          visible={budget.totalSpent >= budget.maxAmount}
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
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <Text variant="labelLarge">{budget.description}</Text>
              <Text variant="labelSmall">{budget.percentage}%</Text>
            </View>

            <BudgetProgressBar {...budget} />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
