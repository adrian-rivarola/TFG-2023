import dayjs from "dayjs";
import { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Surface, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Budget, Transaction } from "../../data";
import { convertToShortScale } from "../../utils/numberUtils";

const screenWidth = Dimensions.get("screen").width;

type BudgetLineChartProps = {
  transactions: Transaction[];
  budget: Budget;
};

export default function BudgetLineChart({
  transactions,
  budget,
}: BudgetLineChartProps) {
  const { theme, isDarkTheme } = useTheme();
  const data = useMemo(() => getGraphData(budget, transactions), [budget]);

  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) =>
      isDarkTheme
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <Surface
      style={{
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
      }}
      elevation={1}
    >
      <View style={{ width: screenWidth - 20, padding: 0 }}>
        <LineChart
          style={{ padding: 10, margin: 0 }}
          data={data}
          chartConfig={chartConfig}
          width={
            screenWidth + screenWidth / (data.datasets[0].data.length - 1) - 85
          }
          height={380}
          segments={4}
          yAxisLabel="Gs "
          withShadow={false}
          formatYLabel={(n) => {
            let num = parseInt(n);
            if (!num) {
              return "0";
            }
            return convertToShortScale(num);
          }}
          withDots={false}
          fromZero
          transparent
          bezier
        />
      </View>
    </Surface>
  );
}
const getGraphData = (budget: Budget, transactions: Transaction[]) => {
  const range = budget.dateRange === "week" ? "day" : "week";
  const startDate = dayjs().startOf(budget.dateRange);
  const endDate = dayjs().endOf(budget.dateRange);
  const diff = endDate.diff(startDate, range);
  const dates = Array.from(new Array(diff)).map((v, i) =>
    startDate.add(i, range)
  );
  const totals: number[] = dates.map(() => 0);
  let acu = 0;

  transactions.reverse().forEach((transaction) => {
    const date = dayjs(transaction.date);
    const idx = Math.abs(startDate.diff(date, range));
    if (idx >= totals.length) {
      totals[totals.length - 1] += transaction.amount;
    } else {
      totals[idx] += transaction.amount;
    }
  });

  const data: LineChartData = {
    datasets: [
      {
        data: totals.map((total) => (acu += total), acu),
      },
    ],
    labels: dates.map((d) => d.format("DD/MM")),
  };

  if (acu >= budget.maxAmount) {
    data.datasets[1] = {
      data: dates.map(() => budget.maxAmount),
      color: () => "red",
      strokeWidth: 2,
    };
  }

  return data;
};
