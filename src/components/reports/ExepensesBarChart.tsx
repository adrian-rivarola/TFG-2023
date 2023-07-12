import { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import type { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import type { ChartData } from 'react-native-chart-kit/dist/HelperTypes';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

import DateRangeSelector from '../DateRangeSelector';
import { SCREEN_WIDTH } from '@/constants/Layout';
import { useExpenseTotals } from '@/hooks/reports';
import { useTheme } from '@/theme/ThemeContext';
import { StringDateRange } from '@/types';
import { convertToShortScale } from '@/utils/numberUtils';
import { useNavigation } from '@react-navigation/native';

export default function ExepensesBarChart() {
  const navigation = useNavigation();
  const { theme, isDarkTheme } = useTheme();
  const [activePeriod, setActivePeriod] = useState<StringDateRange>('week');
  const { data: expenseTotals, isLoading } = useExpenseTotals(activePeriod);

  const chartData: ChartData = {
    datasets: [
      {
        data: expenseTotals?.data || [],
      },
    ],
    labels: expenseTotals?.labels || [],
  };
  const isEmptyData =
    isLoading || expenseTotals?.data.length === 0 || expenseTotals?.data.every((n) => n === 0);

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    fillShadowGradientFrom: theme.colors.expense,
    fillShadowGradientTo: theme.colors.expense,
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientToOpacity: 0.75,
    barPercentage: 0.75,
    color: () => (isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'),
    labelColor: () => theme.colors.text,
    formatYLabel: (n) => {
      const num = parseInt(n, 10);
      if (!num) {
        return '0';
      }
      return convertToShortScale(num, 2);
    },
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="titleMedium">Gastos totales</Text>

        <Button
          mode="text"
          onPress={() => {
            navigation.navigate('BottomTab', {
              screen: 'ReportsScreen',
            });
          }}
        >
          Ver más
        </Button>
      </View>

      <Card elevation={1}>
        <View style={{ margin: 15 }}>
          <DateRangeSelector value={activePeriod} onChange={setActivePeriod} />
        </View>

        <Card.Content>
          {isEmptyData ? (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 10,
              }}
            >
              {isLoading ? (
                <ActivityIndicator style={{ paddingVertical: 100 }} />
              ) : (
                <Text variant="titleSmall">No hay registros en este periodo</Text>
              )}
            </View>
          ) : (
            <BarChart
              fromZero
              style={{
                alignSelf: 'center',
                marginBottom: -10,
                marginStart: -5,
              }}
              segments={4}
              data={chartData}
              chartConfig={chartConfig}
              width={SCREEN_WIDTH - 60}
              height={240}
              yAxisSuffix=""
              yAxisLabel="Gs. "
              yLabelsOffset={-1}
              showBarTops={false}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}