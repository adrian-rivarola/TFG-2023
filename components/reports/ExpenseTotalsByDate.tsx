import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import type { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Button, SegmentedButtons, Surface, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { useMonthTotals } from "../../hooks/reports/useMonthTotals";
import { useWeekTotals } from "../../hooks/reports/useWeekTotals";
import { convertToShortScale } from "../../utils/numberUtils";

type ReportsPreviewProps = {};

const screenWidth = Dimensions.get("screen").width;

export default function ExpenseTotalsByDate(props: ReportsPreviewProps) {
  const navigation = useNavigation();
  const { theme, isDarkTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<"week" | "month">("week");

  const { data: weekTotals } = useWeekTotals();
  const { data: monthTotals } = useMonthTotals();

  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) =>
      isDarkTheme
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
  };

  if (!monthTotals || !weekTotals) {
    return null;
  }
  const chartData = activeSegment === "week" ? weekTotals : monthTotals;
  const emptyData = chartData.datasets[0].data.every((n) => n === 0);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          width: "100%",
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

      <Surface
        style={{
          borderRadius: 10,
          backgroundColor: theme.colors.surface,
        }}
        elevation={1}
      >
        <SegmentedButtons
          style={{
            marginTop: 15,
            alignSelf: "center",
          }}
          value={activeSegment}
          onValueChange={(s) => setActiveSegment(s as any)}
          density="medium"
          buttons={[
            {
              value: "week",
              label: "Esta semana",
            },
            {
              value: "month",
              label: "Este mes",
            },
          ]}
        />

        <View style={{ width: screenWidth - 20, padding: 0 }}>
          <LineChart
            height={200}
            width={screenWidth}
            style={{ paddingTop: 10 }}
            data={chartData}
            chartConfig={chartConfig}
            segments={emptyData ? 0 : 3}
            withShadow={false}
            yAxisLabel="Gs "
            formatYLabel={(n) => {
              let num = parseInt(n);
              if (!num) {
                return "0";
              }
              const decimal = activeSegment === "week" ? 0 : 1;
              return convertToShortScale(num, decimal);
            }}
            withDots={false}
            fromZero
            transparent
            bezier
          />
        </View>
      </Surface>
    </>
  );
}
