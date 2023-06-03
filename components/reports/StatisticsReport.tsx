import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Card, DataTable, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { DateRange } from "../../utils/dateUtils";

type CategotyChartData = {
  categoryName: string;
  categoryIcon: string;
  total: number;
  color: string;
  percentage: number;
};

const COLORS = [
  "#ffa600",
  "#ff7c43",
  "#f95d6a",
  "#d45087",
  "#a05195",
  "#665191",
  "#2f4b7c",
  "#003f5c",
];

type StatisticsReportProps = {
  dateRange: DateRange;
};

export default function StatisticsReport({ dateRange }: StatisticsReportProps) {
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    console.log(JSON.stringify({ dateRange }, undefined, 2));

    // const total

    // Transaction
  }, [dateRange]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Card elevation={1} mode="elevated">
          <Card.Title title="Transacciones" titleVariant="titleMedium" />

          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{""}</DataTable.Title>
                <DataTable.Title numeric>Egresos</DataTable.Title>
                <DataTable.Title numeric>Ingresos</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Cantidad</DataTable.Cell>
                <DataTable.Cell numeric>159</DataTable.Cell>
                <DataTable.Cell numeric>6.0</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Monto total</DataTable.Cell>
                <DataTable.Cell numeric>237</DataTable.Cell>
                <DataTable.Cell numeric>8.0</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Promedio</DataTable.Cell>
                <DataTable.Cell numeric>237</DataTable.Cell>
                <DataTable.Cell numeric>8.0</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
