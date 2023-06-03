import { View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";
import { Budget } from "../../data";
import { formatCurrency } from "../../utils/numberUtils";

type BudgetPercentageBarProps = {
  budget: Budget;
};

export default function BudgetPercentageBar({
  budget,
}: BudgetPercentageBarProps) {
  const percentage = Math.min(budget.totalSpent / budget.maxAmount, 100);
  let color: string;

  switch (true) {
    case percentage < 0.5:
      color = "#47B39C";
      break;
    case percentage < 0.85:
      color = "#FFC154";
      break;
    default:
      color = "#EC6B56";
      break;
  }

  return (
    <View>
      <ProgressBar
        progress={percentage}
        color={color}
        style={{ marginTop: 5, marginBottom: 5 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text variant="labelMedium">{formatCurrency(budget.totalSpent)}</Text>
        <Text variant="labelMedium">{formatCurrency(budget.maxAmount)}</Text>
      </View>
    </View>
  );
}
