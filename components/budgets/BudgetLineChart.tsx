import dayjs from "dayjs";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Surface } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Budget, Transaction } from "../../data";
import { groupTransactionsByRange } from "../../utils/transactionUtils";

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

  const transactionRange = budget.dateRange === "week" ? "day" : "week";
  const groupedTransaction = groupTransactionsByRange(
    transactionRange,
    transactions
  );
  const starDate = dayjs().startOf(budget.dateRange);
  const endDate = dayjs().endOf(budget.dateRange);
  const dif = endDate.diff(starDate, transactionRange);

  const data: LineChartData = {
    datasets: [
      {
        data: [],
      },
    ],
    labels: [],
  };

  let acc = 0;

  Object.entries(groupedTransaction)
    .reverse()
    .forEach(([date, transactions]) => {
      const dateTotals = transactions.reduce((acc, t) => acc + t.amount, 0);
      data.labels.push(date.split(", ")[1]);
      data.datasets[0].data.push(acc + dateTotals);
      acc += dateTotals;
    });
  // }, [transactions]);
  data.datasets[1] = {
    data: data.datasets[0].data.map(() => budget.maxAmount),
    color: () => "red",
  };

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
          style={{ paddingTop: 12 }}
          data={data}
          chartConfig={chartConfig}
          width={screenWidth - 20}
          segments={3}
          height={200}
          yAxisLabel="Gs "
          withShadow={false}
          formatYLabel={(n) => {
            let num = parseInt(n);
            if (!num) {
              return "0";
            }
            return Math.floor(num / 1000) + "K";
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
