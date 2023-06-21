import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import type { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import type { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";

import { useExpenseTotals } from "../../hooks/reports/useExpenseTotals";
import { useTheme } from "../../theme/ThemeContext";
import { StringDateRange } from "../../utils/dateUtils";
import { convertToShortScale, formatCurrency } from "../../utils/numberUtils";
import DateRangeSelector from "../DateRangeSelector";

type ExepensesChartProps = {};

const screenWidth = Dimensions.get("screen").width;

export default function ExepensesChart(props: ExepensesChartProps) {
  const navigation = useNavigation();
  const { theme, isDarkTheme } = useTheme();
  const [activePeriod, setActivePeriod] = useState<StringDateRange>("week");
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
    isLoading ||
    expenseTotals?.data.length === 0 ||
    expenseTotals?.data.every((n) => n === 0);

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    fillShadowGradientFrom: theme.colors.expense,
    fillShadowGradientTo: theme.colors.expense,
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientToOpacity: 0.75,
    barPercentage: 0.75,
    color: () =>
      isDarkTheme ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)",
    labelColor: () => theme.colors.text,
    formatYLabel: (n) => {
      let num = parseInt(n);
      if (!num) {
        return "0";
      }
      return convertToShortScale(num);
    },
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="titleMedium">Gastos totales</Text>

        <Button
          mode="text"
          onPress={() => {
            navigation.navigate("BottomTab", {
              screen: "ReportsScreen",
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
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              {isLoading ? (
                <ActivityIndicator style={{ paddingVertical: 100 }} />
              ) : (
                <Text variant="titleSmall">
                  No hay registros en este periodo
                </Text>
              )}
            </View>
          ) : (
            <BarChart
              fromZero
              style={{
                alignSelf: "center",
              }}
              segments={4}
              data={chartData}
              chartConfig={chartConfig}
              width={screenWidth - 60}
              height={240}
              yAxisSuffix=""
              yAxisLabel="Gs. "
              showBarTops={false}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
