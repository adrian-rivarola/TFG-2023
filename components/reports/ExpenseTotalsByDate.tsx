import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Button, SegmentedButtons, Surface, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { useMonthTotals } from "../../hooks/reports/useMonthTotals";
import { useWeekTotals } from "../../hooks/reports/useWeekTotals";

type ReportsPreviewProps = {};

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
            style={{ paddingTop: 10 }}
            data={activeSegment === "week" ? weekTotals : monthTotals}
            chartConfig={chartConfig}
            width={screenWidth - 20}
            segments={3}
            height={200}
            withShadow={false}
            yAxisLabel="Gs "
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
    </>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginVertical: 20,
    // width: screenWidth - 20,
  },
});
