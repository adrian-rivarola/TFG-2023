import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import {
  Button,
  Card,
  SegmentedButtons,
  Surface,
  Text,
} from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { useMonthTotals } from "../../hooks/report/useMonthTotals";
import { useWeekTotals } from "../../hooks/report/useWeekTotals";

type ReportsPreviewProps = {};
type ReportOption = "week" | "month";

export default function ReportsPreview(props: ReportsPreviewProps) {
  const navigation = useNavigation();
  const { theme, isDarkTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<ReportOption>("week");

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
    <Surface
      style={{
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
      }}
      elevation={3}
    >
      <View style={styles.titleContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Reporte de Gastos
        </Text>

        <SegmentedButtons
          value={activeSegment}
          onValueChange={(s) => setActiveSegment(s as ReportOption)}
          density="medium"
          buttons={[
            {
              value: "month",
              label: "Este mes",
            },
            {
              value: "week",
              label: "Esta semana",
            },
          ]}
        />
      </View>

      <View style={{ width: screenWidth - 20, padding: 0 }}>
        <LineChart
          style={{ paddingTop: 12 }}
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

      <Button
        mode="text"
        style={{
          width: 120,
          alignSelf: "center",
        }}
        onPress={() => {
          navigation.navigate("ReportsScreen");
        }}
      >
        Ver más
      </Button>
    </Surface>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: screenWidth - 20,
  },
  title: {
    marginBottom: 8,
  },
});
