import { useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { Card } from 'react-native-paper';

import { Budget, Transaction } from '../../data';
import { useTheme } from '../../theme/ThemeContext';
import { getBudgetStatusColor, getBudgetTrend } from '../../utils/budgetUtils';
import { convertToShortScale } from '../../utils/numberUtils';

const screenWidth = Dimensions.get('screen').width;

type BudgetLineChartProps = {
  transactions: Transaction[];
  budget: Budget;
};

export default function BudgetLineChart({ transactions, budget }: BudgetLineChartProps) {
  const { theme, isDarkTheme } = useTheme();
  const data = useMemo(() => getGraphData(), [transactions]);

  const lineColor = getBudgetStatusColor(budget.percentage);
  const chartWidth = screenWidth + screenWidth / (data.datasets[0].data.length - 1) - 85;
  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) =>
      isDarkTheme ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  };

  function getGraphData() {
    const { trend, labels } = getBudgetTrend(budget);

    const chartData: LineChartData = {
      datasets: [
        {
          data: trend,
          color: () => lineColor,
          withScrollableDot: true,
        },
      ],
      labels,
    };

    if (budget.totalSpent >= budget.maxAmount) {
      chartData.datasets[1] = {
        color: () => 'red',
        data: trend.map(() => budget.maxAmount),
        withDots: false,
        strokeWidth: 2,
        strokeDashArray: [8],
      };
    }

    return chartData;
  }

  return (
    <Card elevation={1}>
      <View style={{ padding: 0 }}>
        <LineChart
          fromZero
          transparent
          withShadow={false}
          chartConfig={chartConfig}
          style={{ padding: 10, paddingBottom: -20, margin: 0, overflow: 'hidden' }}
          width={chartWidth}
          height={380}
          data={data}
          segments={5}
          yAxisLabel="Gs "
          formatYLabel={(n) => {
            const num = parseInt(n, 10);
            if (!num) {
              return '0';
            }
            return convertToShortScale(num);
          }}
        />
      </View>
    </Card>
  );
}
