import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Button, Card, SegmentedButtons, Text } from "react-native-paper";

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
    <View style={styles.reportsContainer}>
      <Text style={styles.title}>Reporte de Gastos</Text>
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
      <Card
        mode="outlined"
        style={{ marginTop: 16, width: screenWidth - 50, padding: 0 }}
      >
        <LineChart
          style={{ paddingTop: 12 }}
          data={activeSegment === "week" ? weekTotals : monthTotals}
          chartConfig={chartConfig}
          width={screenWidth - 50}
          height={250}
          // segments={activeSegment === "month" ? 5 : 4}
          yAxisLabel="Gs "
          formatYLabel={(n) => {
            let num = parseInt(n);
            if (!num) {
              return "0";
            }
            return Math.floor(num / 1000) + "K";
          }}
          // getDotColor={(dp) =>
          //   dp > 0 ? theme.colors.text : theme.colors.backdrop
          // }
          withDots={false}
          transparent
          bezier
        />
      </Card>
      <View>
        <Button
          onPress={() => {
            navigation.navigate("ReportsScreen");
          }}
        >
          Ver más
        </Button>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  reportsContainer: {
    alignItems: "center",
    width: screenWidth - 50,
  },
  reportWitdh: {
    width: screenWidth - 50,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
});
