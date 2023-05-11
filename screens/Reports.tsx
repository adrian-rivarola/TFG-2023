import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Card, Text } from "react-native-paper";

import Balance from "../components/Balance";
import { useTheme } from "../context/ThemeContext";
import { CategoryType, Transaction } from "../data";
import { RootTabScreenProps } from "../types";
import ReportsPreview from "../components/reports/ReportsPreview";

type ScreenProps = RootTabScreenProps<"ReportsScreen">;
type CategotyChartData = {
  name: string;
  total: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export default function Reports({ navigation, route }: ScreenProps) {
  const [expensePieChartData, setExpensePieChartData] = useState<
    CategotyChartData[]
  >([]);
  const [incomePieChartData, setIncomePieChartData] = useState<
    CategotyChartData[]
  >([]);
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
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    Transaction.getTotalsByCategoryType(
      CategoryType.expense,
      "2023-01-01",
      "2023-12-31"
    ).then((data) => {
      setExpensePieChartData(
        data.map((d, i) => ({
          name: d.category,
          total: d.total,
          color: expenseColors[i],
          legendFontColor: theme.colors.text,
          legendFontSize: 14,
        }))
      );
    });
    Transaction.getTotalsByCategoryType(
      CategoryType.income,
      "2023-01-01",
      "2023-12-31"
    ).then((data) => {
      setIncomePieChartData(
        data.map((d, i) => ({
          name: d.category,
          total: d.total,
          color: incomeColors[i],
          legendFontColor: theme.colors.text,
          legendFontSize: 14,
        }))
      );
    });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance />

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
            <Text
              style={{ alignSelf: "center", marginTop: 5 }}
              variant="bodyMedium"
            >
              Total de egresos: Gs.{" "}
              {expensePieChartData
                .reduce((a, b) => a + b.total, 0)
                .toLocaleString()}
            </Text>
          </>
        )}

        {/* <View style={styles.mt2} />
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
            <Text
              style={{ alignSelf: "center", marginTop: 5 }}
              variant="bodyMedium"
            >
              Total de ingresos: Gs.{" "}
              {incomePieChartData
                .reduce((a, b) => a + b.total, 0)
                .toLocaleString()}
            </Text>
          </>
        )} */}
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
    alignItems: "center",
  },
  smallSeparator: {
    marginVertical: 10,
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
