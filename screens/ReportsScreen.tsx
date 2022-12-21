import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Text } from "react-native-paper";
import Balance from "../components/Balance";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import { CategoryType } from "../data/classes/Category";
import ReportService from "../data/classes/Report";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "ReportsScreen">;

export default function ReportsScreen({ navigation, route }: ScreenProps) {
  const screenWidth = Dimensions.get("window").width;
  const [expensePieChartData, setExpensePieChartData] = useState<any>([]);
  const [incomePieChartData, setIncomePieChartData] = useState<any>([]);
  const [balance, setBalance] = useState(0);
  const { theme } = useTheme();

  const expenseColors = [
    "rgba(131, 167, 234, 1)",
    "rgb(251, 223, 166)",
    "rgb(255, 180, 171)",
    "rgb(188, 235, 238)",
    "rgb(0, 110, 0)",
    "rgb(225, 224, 249)",
  ];
  const incomeColors = [
    "rgb(225, 224, 249)",
    "rgb(255, 180, 171)",
    "rgb(251, 223, 166)",
    "rgb(188, 235, 238)",
    "rgba(131, 167, 234, 1)",
    "rgb(0, 110, 0)",
  ];
  const chartConfig: AbstractChartConfig = {
    labelColor: () => theme.colors.text,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  useEffect(() => {
    const reportService = new ReportService();
    reportService.getBalance().then(setBalance);
    reportService.getCategoryTotals(CategoryType.expense).then((data) => {
      setExpensePieChartData(
        data.map((d, i) => ({
          name: d.category,
          total: d.total,
          color: expenseColors[i],
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        }))
      );
    });
    reportService.getCategoryTotals(CategoryType.income).then((data) => {
      setIncomePieChartData(
        data.map((d, i) => ({
          name: d.category,
          total: d.total,
          color: incomeColors[i],
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        }))
      );
    });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance balance={balance} />
        {expensePieChartData && (
          <>
            <Text style={[styles.ms2, styles.mt2]} variant="titleSmall">
              Egresos según su categoría:
            </Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={expensePieChartData}
                width={screenWidth - 10}
                height={200}
                chartConfig={chartConfig}
                accessor={"total"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
              />
            </View>
          </>
        )}
        <View style={styles.mt2} />
        {incomePieChartData.length > 0 && (
          <>
            <Text style={[styles.ms2, styles.mt2]} variant="titleSmall">
              Ingresos según su categoría:
            </Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={incomePieChartData}
                width={screenWidth - 10}
                height={200}
                chartConfig={chartConfig}
                accessor={"total"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pieChartContainer: {
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
  transactionInfo: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ms2: {
    marginStart: 16,
  },
  mt2: {
    marginTop: 16,
  },
  mb2: {
    marginBottom: 16,
  },
  amount: {
    marginTop: 16,
    marginStart: 32,
  },
  description: {
    flexDirection: "row",
    marginTop: 16,
    marginStart: 32,
  },
  budgetInfo: {
    marginTop: 16,
  },
  budgetCard: {
    marginTop: 16,
  },
});
