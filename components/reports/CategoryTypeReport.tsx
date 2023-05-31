import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, ProgressBar, Text } from "react-native-paper";
import PieChart from "react-native-pie-chart";

import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { CategoryType, Transaction } from "../../data";
import { getDatesFromRange } from "../../utils/dateUtils";
import { formatCurrency } from "../../utils/numberFormatter";
import DateFilterFAB from "../DateFilterFAB";

type TransactionsReportProps = {
  categoryType: CategoryType;
};
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

export default function CategoryTypeReport({
  categoryType,
}: TransactionsReportProps) {
  const {
    theme: { colors },
  } = useTheme();
  const isFocused = useIsFocused();

  const [range, setRange] = useState(getDatesFromRange("week"));
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [pieChartData, setPieChartData] = useState<CategotyChartData[]>([]);

  const categoryColor =
    categoryType === CategoryType.expense ? colors.expense : colors.income;
  const categoryTitle =
    categoryType === CategoryType.expense ? "Egresos" : "Ingresos";
  const size = 250;

  useEffect(() => {
    const { startDate, endDate } = range;

    Transaction.getTotalsByCategoryType(categoryType, startDate, endDate).then(
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
  }, [range]);

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <Text variant="titleSmall" style={{ alignSelf: "center" }}>
          {dateInfo(range)}
        </Text>

        {pieChartData.length !== 0 ? (
          <View style={{ alignItems: "center" }}>
            <Text variant="titleMedium" style={{ marginTop: 20 }}>
              {categoryTitle} por categoría
            </Text>

            <View
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <Text
                variant="headlineSmall"
                style={{
                  position: "absolute",
                  zIndex: 100,
                }}
              >
                {Math.floor(categoryTotal / 1000) + " K"}
              </Text>

              <PieChart
                series={pieChartData.map((d) => d.total)}
                sliceColor={pieChartData.map((d) => d.color)}
                widthAndHeight={size}
                coverRadius={0.44}
                coverFill={colors.background}
              />
            </View>
          </View>
        ) : (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <Text variant="bodyMedium">
              No hay registros en este periodo de tiempo
            </Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 40 }}>
          {pieChartData.map((d, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Avatar.Icon
                style={{
                  backgroundColor: d.color,
                  marginEnd: 10,
                  height: 40,
                  width: 40,
                }}
                icon={() => (
                  <MaterialIcons
                    name={d.categoryIcon as any}
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
                  <Text variant="titleMedium">{d.categoryName}</Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      color: categoryColor,
                    }}
                  >
                    {formatCurrency(d.total)}
                  </Text>
                </View>

                <ProgressBar progress={d.percentage} color={d.color} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {isFocused && <DateFilterFAB onChange={setRange} />}
    </>
  );
}

function dateInfo(range: { startDate: string; endDate: string }) {
  const startDate = dayjs(range.startDate);
  const endDate = dayjs(range.endDate);

  if (startDate.isSame(endDate, "month")) {
    return `${startDate.format("D")} al ${endDate.format("D [de] MMMM")}`;
  } else {
    return `${startDate.format("D [de] MMMM")} al ${endDate.format(
      "D [de] MMMM"
    )}`;
  }
}
