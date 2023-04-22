import { useNavigation } from "@react-navigation/native";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { Button, Card, SegmentedButtons, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import * as reportService from "../../services/reportService";

type ReportsPreviewProps = {};
type ReportOption = "week" | "month";

type ReportData = {
  [k in ReportOption]: ChartData;
};

const mockReportData: ReportData = {
  week: {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    datasets: [
      {
        data: [0, 0, 0],
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
const WEEK_LABELS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function ReportsPreview(props: ReportsPreviewProps) {
  const { theme, isDarkTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<ReportOption>("week");
  const [reportData, setReportData] = useState(mockReportData);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const hasData = reportData.week.datasets[0].data.some((d) => d > 0);

  useEffect(() => {
    getReportsData();
  }, []);

  const getReportsData = async () => {
    const weekData = await getWeekData();
    const monthData = await getMonthData();

    setReportData({
      ...weekData,
      ...monthData,
    });
    setLoading(false);
  };

  const getWeekData = async () => {
    const weekStart = dayjs().startOf("week");
    const weekDates: string[] = [];

    for (let i = 0; i < 7; i++) {
      weekDates.push(weekStart.add(i, "days").format("YYYY-MM-DD"));
    }
    const weekData = await reportService.getWeekTotals(
      weekDates[0],
      weekDates[weekDates.length - 1]
    );
    const weekReportData = weekDates.map(
      (d) => weekData.find((wd) => wd.date === d)?.total || 0
    );
    return {
      week: {
        labels: WEEK_LABELS,
        datasets: [
          {
            data: weekReportData,
          },
        ],
      },
    };
  };

  const getMonthData = async () => {
    let monthStart = dayjs().startOf("month");

    // get first monday
    while (monthStart.day() !== 1) {
      monthStart = monthStart.add(1, "day");
    }

    const monthDates: Dayjs[] = [];

    for (let i = 0; i < 4; i++) {
      monthDates.push(monthStart.add(i, "weeks"));
    }
    const monthData = await reportService.getMonthlyTotals(
      monthDates[0].format("YYYY-MM-DD")
    );
    const monthReportData = monthDates.map(
      (d) =>
        monthData.find((md) => md.weekStart === d.format("YYYY-MM-DD"))
          ?.totalTransactions || 0
    );
    return {
      month: {
        labels: monthDates.map((d) => d.format("DD/MM")),
        datasets: [
          {
            data: monthReportData,
          },
        ],
      },
    };
  };

  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) =>
      isDarkTheme
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
  };

  if (loading || !hasData) {
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
          getDotColor={(dp) =>
            dp > 0 ? theme.colors.text : theme.colors.backdrop
          }
          data={reportData[activeSegment]}
          chartConfig={chartConfig}
          width={screenWidth - 50}
          height={250}
          segments={activeSegment === "month" ? 5 : 4}
          yAxisLabel="Gs "
          formatYLabel={(n) => {
            let num = parseInt(n);
            if (!num) {
              return "0";
            }
            return Math.floor(num / 1000) + "K";
          }}
          transparent
          fromZero
        />
      </Card>
      {hasData && (
        <View>
          <Button
            onPress={() => {
              navigation.navigate("Root", {
                screen: "ReportsScreen",
              });
            }}
          >
            Ver más
          </Button>
        </View>
      )}
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
