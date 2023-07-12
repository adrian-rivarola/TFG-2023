import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { BarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';
import { Card } from 'react-native-paper';

import { SCREEN_WIDTH } from '@/constants/Layout';
import { Budget } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { getBudgetStatusColor } from '@/utils/budgetUtils';
import { convertToShortScale } from '@/utils/numberUtils';

type PeriodsBarChartProps = {
  budget: Budget;
};

export default function PeriodsBarChart({ budget }: PeriodsBarChartProps) {
  const { theme, isDarkTheme } = useTheme();

  const chartData = useMemo<ChartData>(() => {
    const { dateRange, previousPeriods } = budget;
    const dateFormat = dateRange === 'month' ? 'MMM' : 'DD/MM';
    const data = previousPeriods.map((p) => p.totalSpent);
    const labels = previousPeriods.map((p) => dayjs(p.dateRange.startDate).format(dateFormat));

    if (previousPeriods.length < 6) {
      for (let i = 0; i < 6 - previousPeriods.length; i++) {
        data.push(0);
        labels.push('');
      }
    }

    return {
      datasets: [
        {
          data,
          colors: previousPeriods.map(
            (value) => () => getBudgetStatusColor((value.totalSpent / budget.maxAmount) * 100)
          ),
        },
      ],
      labels,
    };
  }, [budget]);

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientToOpacity: 0.75,
    barPercentage: 1,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
    },
    color: () => (isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
    labelColor: () => theme.colors.text,
    formatTopBarValue: (val) => (val > 0 ? convertToShortScale(val, 1) : ''),
    formatYLabel: (n) => {
      const num = parseInt(n, 10);
      if (!num) {
        return '0';
      }
      return convertToShortScale(num, 2);
    },
  };
  const chartWidth = Math.max(SCREEN_WIDTH - 60, 50 * budget.previousPeriods.length + 1);

  return (
    <Card elevation={1} style={{ marginBottom: 15 }}>
      <Card.Content>
        <BarChart
          withCustomBarColorFromData
          showValuesOnTopOfBars
          flatColor
          fromZero
          style={{
            alignSelf: 'flex-start',
            marginBottom: -10,
            marginStart: -5,
          }}
          segments={5}
          data={chartData}
          chartConfig={chartConfig}
          showBarTops={false}
          width={chartWidth}
          height={340}
          yAxisSuffix=""
          yAxisLabel="Gs. "
          yLabelsOffset={-1}
        />
      </Card.Content>
    </Card>
  );
}
