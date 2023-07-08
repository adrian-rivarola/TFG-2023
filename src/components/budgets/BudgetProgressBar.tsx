import { View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

import { getBudgetStatusColor } from '@/utils/budgetUtils';
import { formatCurrency } from '@/utils/numberUtils';

type BudgetProgressBarProps = {
  maxAmount: number;
  totalSpent: number;
};

export default function BudgetProgressBar({ maxAmount, totalSpent }: BudgetProgressBarProps) {
  const percentage = Math.floor((totalSpent / maxAmount) * 100);
  const barProgress = Math.min(percentage / 100, 100);
  const color = getBudgetStatusColor(percentage);

  return (
    <View>
      <ProgressBar progress={barProgress} color={color} style={{ marginTop: 5, marginBottom: 5 }} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="labelMedium">{formatCurrency(totalSpent)}</Text>
        <Text variant="labelMedium">{formatCurrency(maxAmount)}</Text>
      </View>
    </View>
  );
}
