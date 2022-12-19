import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { Card, SegmentedButtons, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import ReportService from "../../data/classes/Report";

type ReportsPreviewProps = {};
type ReportOption = "week" | "month";

type ReportData = {
  [k in ReportOption]: ChartData;
};

const mockReportData: ReportData = {
  week: {
    labels: ["L", "M", "M", "J", "V", "S", "D"],
    datasets: [
      {
        data: [12_500, 8_000, 9_500, 12_000, 18_000, 21_000, 32_000],
      },
    ],
  },
  month: {
    labels: ["01/11", "08/11", "15/11", "21/11"],
    datasets: [
      {
        data: [320_000, 210_000, 140_000, 380_000],
      },
    ],
  },
};

const reportService = new ReportService();

export default function ReportsPreview(props: ReportsPreviewProps) {
  const { theme, isDarkTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<ReportOption>("week");
  const [reportData, setReportData] = useState(mockReportData);

  useEffect(() => {
    reportService.getWeekTotals().then(() => {
      setReportData({
        ...reportData,
        week: {
          ...reportData.week,
          datasets: [
            {
              data: Object.values(reportService.weekTotals),
            },
          ],
        },
      });
    });
  }, []);

  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) =>
      isDarkTheme
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
  };

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
        style={{ marginTop: 8, width: screenWidth - 50, padding: 0 }}
      >
        <LineChart
          style={{ paddingTop: 12 }}
          getDotColor={() => theme.colors.text}
          data={reportData[activeSegment]}
          chartConfig={chartConfig}
          width={screenWidth - 50}
          height={250}
          xLabelsOffset={-4}
          yAxisLabel="Gs "
          formatYLabel={(n) => {
            let num = parseInt(n);
            if (!num) {
              return "0";
            }
            return num / 1000 + "K";
          }}
          transparent
          fromZero
          bezier
        />
      </Card>
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
