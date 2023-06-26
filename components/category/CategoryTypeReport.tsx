import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Card, DataTable, ProgressBar, Text } from 'react-native-paper';
import PieChart from 'react-native-pie-chart';

import { CategoryTotal, CategoryType, Transaction } from '../../data';
import { useTheme } from '../../theme/ThemeContext';
import { globalStyles } from '../../theme/globalStyles';
import { DateRange } from '../../utils/dateUtils';
import { convertToShortScale } from '../../utils/numberUtils';

type CategotyChartData = CategoryTotal & {
  color: string;
  percentage: number;
};

const COLORS = [
  '#ffa600',
  '#665191',
  '#003f5c',
  '#2f4b7c',
  '#a05195',
  '#d45087',
  '#f95d6a',
  '#ff7c43',
];

type TransactionsReportProps = {
  dateRange?: DateRange;
  categoryType: CategoryType;
};

export default function CategoryTypeReport({ categoryType, dateRange }: TransactionsReportProps) {
  const {
    theme: { colors },
  } = useTheme();

  const [categoryTotal, setCategoryTotal] = useState(0);
  const [pieChartData, setPieChartData] = useState<CategotyChartData[]>([]);

  const transactionsCount = pieChartData.reduce((acc, d) => acc + d.count, 0);
  const average = pieChartData.reduce((acc, d) => acc + d.total, 0) / transactionsCount;

  const categoryTitle = categoryType === CategoryType.expense ? 'Gastos' : 'Ingresos';
  const size = 250;

  useEffect(() => {
    Transaction.getTotalsByCategoryType(categoryType, dateRange).then((data) => {
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
    });
  }, [dateRange]);

  if (pieChartData.length === 0) {
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <Text variant="bodyMedium">No hay registros en este periodo de tiempo</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={globalStyles.screenContainer}>
        <Card>
          <Card.Title title={`${categoryTitle} por categoría`} titleVariant="titleMedium" />

          <Card.Content>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}>
              <Text
                variant="headlineSmall"
                style={{
                  position: 'absolute',
                  zIndex: 100,
                }}>
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

            <View style={{}}>
              {pieChartData.map((d, i) => (
                <CategoryAmount key={i} data={d} />
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card
          elevation={1}
          mode="elevated"
          style={{
            marginTop: 20,
          }}>
          <Card.Title title="Transacciones" titleVariant="titleMedium" />

          <Card.Content>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Cantidad</DataTable.Cell>
                <DataTable.Cell numeric>{transactionsCount}</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Promedio</DataTable.Cell>
                <DataTable.Cell numeric>Gs. {convertToShortScale(average, 2)}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>

        <View style={{ paddingVertical: 50 }} />
      </View>
    </ScrollView>
  );
}

type CategoryAmountProps = {
  data: CategotyChartData;
};

function CategoryAmount({ data }: CategoryAmountProps) {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <Avatar.Icon
        style={{
          backgroundColor: data.color,
          marginEnd: 10,
          height: 40,
          width: 40,
        }}
        icon={() => <MaterialIcons name={data.categoryIcon as any} color={colors.card} size={20} />}
      />

      <View style={{ flexGrow: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            variant="titleMedium"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              maxWidth: 160,
            }}>
            {data.categoryName}
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: colors.text,
            }}>
            Gs. {convertToShortScale(data.total)}
          </Text>
        </View>

        <ProgressBar progress={data.percentage} color={data.color} />
      </View>
    </View>
  );
}
