import { View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

import { Budget } from '../../data';
import { getBudgetStatusColor } from '../../utils/budgetUtils';
import { formatCurrency } from '../../utils/numberUtils';

type BudgetProgressBarProps = {
  budget: Budget;
};

export default function BudgetProgressBar({ budget }: BudgetProgressBarProps) {
  const barProgress = Math.min(budget.percentage / 100, 100);
  const color = getBudgetStatusColor(budget.percentage);

  return (
    <View>
      <ProgressBar progress={barProgress} color={color} style={{ marginTop: 5, marginBottom: 5 }} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text variant="labelMedium">{formatCurrency(budget.totalSpent)}</Text>
        <Text variant="labelMedium">{formatCurrency(budget.maxAmount)}</Text>
      </View>
    </View>
  );
}
