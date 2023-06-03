import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Card, DataTable, ProgressBar, Text } from "react-native-paper";
import PieChart from "react-native-pie-chart";

import { useTheme } from "../../context/ThemeContext";
import { CategoryTotal, CategoryType, Transaction } from "../../data";
import { DateRange } from "../../utils/dateUtils";
import { convertToShortScale, formatCurrency } from "../../utils/numberUtils";

type CategotyChartData = CategoryTotal & {
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

type TransactionsReportProps = {
  dateRange: DateRange;
  categoryType: CategoryType;
};

export default function CategoryTypeReport({
  categoryType,
  dateRange,
}: TransactionsReportProps) {
  const {
    theme: { colors },
  } = useTheme();

  const [categoryTotal, setCategoryTotal] = useState(0);
  const [pieChartData, setPieChartData] = useState<CategotyChartData[]>([]);

  const transactionsCount = pieChartData.reduce((acc, d) => acc + d.count, 0);
  const average =
    pieChartData.reduce((acc, d) => acc + d.total, 0) / transactionsCount;

  const categoryColor =
    categoryType === CategoryType.expense ? colors.expense : colors.income;
  const categoryTitle =
    categoryType === CategoryType.expense ? "Gastos" : "Ingresos";
  const size = 250;

  useEffect(() => {
    // console.log(JSON.stringify({ dateRange }, undefined, 2));

    Transaction.getTotalsByCategoryType(categoryType, dateRange).then(
      (data) => {
        const res = [];
        let total = 0;

        for (let i = 0; i < data.length; i++) {
          total += data[i].total;
          res.push({
            ...data[i],
            color: COLORS[categoryType * 2 + (i % COLORS.length)],
          });
        }

        setPieChartData(
          res.map((r) => ({
            ...r,
            percentage: r.total / total,
          }))
        );
        setCategoryTotal(total);
      }
    );
  }, [dateRange]);

  if (pieChartData.length === 0) {
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <Text variant="bodyMedium">
          No hay registros en este periodo de tiempo
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Card>
        <Card.Title
          title={`${categoryTitle} por categoría`}
          titleVariant="titleMedium"
        />

        <Card.Content>
          <View
            style={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Text
              variant="headlineSmall"
              style={{
                position: "absolute",
                zIndex: 100,
              }}
            >
              {convertToShortScale(categoryTotal)}
            </Text>

            <PieChart
              series={pieChartData.map((d) => d.total)}
              sliceColor={pieChartData.map((d) => d.color)}
              widthAndHeight={size}
              coverRadius={0.44}
              coverFill={colors.background}
            />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {pieChartData.map((d, i) => (
              <CategoryAmount key={i} data={d} amountColor={categoryColor} />
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card
        elevation={1}
        mode="elevated"
        style={{
          marginTop: 30,
        }}
      >
        <Card.Title title="Transacciones" titleVariant="titleMedium" />

        <Card.Content>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>Cantidad</DataTable.Cell>
              <DataTable.Cell numeric>{transactionsCount}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Promedio</DataTable.Cell>
              <DataTable.Cell numeric>{formatCurrency(average)}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>

      <View style={{ paddingVertical: 50 }} />
    </ScrollView>
  );
}

type CategoryAmountProps = {
  data: CategotyChartData;
  amountColor: string;
};

function CategoryAmount({ data, amountColor }: CategoryAmountProps) {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Avatar.Icon
        style={{
          backgroundColor: data.color,
          marginEnd: 10,
          height: 40,
          width: 40,
        }}
        icon={() => (
          <MaterialIcons
            name={data.categoryIcon as any}
            color={colors.card}
            size={20}
          />
        )}
      />

      <View style={{ flexGrow: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text variant="titleMedium">{data.categoryName}</Text>
          <Text
            variant="titleSmall"
            style={{
              color: amountColor,
            }}
          >
            {formatCurrency(data.total)}
          </Text>
        </View>

        <ProgressBar progress={data.percentage} color={data.color} />
      </View>
    </View>
  );
}
