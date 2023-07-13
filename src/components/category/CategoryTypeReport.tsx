import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, ProgressBar, Text } from 'react-native-paper';
import PieChart from 'react-native-pie-chart';

import CardHeader from '../CardHeader';
import EmptyCard from '../EmptyCard';
import { CategoryTotal, CategoryType } from '@/data';
import { useCategoryTypeTotals } from '@/hooks/reports';
import { useTheme } from '@/theme/ThemeContext';
import { globalStyles } from '@/theme/globalStyles';
import { DateRange } from '@/types';
import { convertToShortScale } from '@/utils/numberUtils';
import { MaterialIcons } from '@expo/vector-icons';

type CategotyChartData = CategoryTotal & {
  color: string;
  percentage: number;
};

type TransactionsReportProps = {
  dateRange?: DateRange;
  categoryType: CategoryType;
};

export default function CategoryTypeReport({ categoryType, dateRange }: TransactionsReportProps) {
  const {
    theme: { colors },
  } = useTheme();

  const { data: pieChartData, isLoading } = useCategoryTypeTotals(categoryType, dateRange);
  const categoryTotal = useMemo(() => {
    return pieChartData?.reduce((acc, val) => acc + val.total, 0) ?? 0;
  }, [pieChartData]);

  const categoryTitle = categoryType === CategoryType.expense ? 'Gastos' : 'Ingresos';
  const size = 250;

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!pieChartData?.length) {
    return <EmptyCard style={{ margin: 10 }} />;
  }

  return (
    <ScrollView>
      <View style={globalStyles.screenContainer}>
        <CardHeader title={`${categoryTitle} por categoría`}>
          <Card elevation={1}>
            <Card.Content>
              <View
                style={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                  }}
                >
                  {convertToShortScale(categoryTotal, 2)}
                </Text>

                <PieChart
                  series={pieChartData.map((d) => d.total)}
                  sliceColor={pieChartData.map((d) => d.color)}
                  widthAndHeight={size}
                  coverRadius={0.44}
                  coverFill={colors.background}
                />
              </View>

              <View>
                {pieChartData.map((d, i) => (
                  <CategoryAmount key={i} data={d} />
                ))}
              </View>
            </Card.Content>
          </Card>
        </CardHeader>

        <View style={{ paddingVertical: 10 }} />
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
          <MaterialIcons name={data.category.icon as any} color={colors.card} size={20} />
        )}
      />

      <View style={{ flexGrow: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            variant="titleMedium"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              maxWidth: 160,
            }}
          >
            {data.category.name}
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: colors.text,
            }}
          >
            Gs. {convertToShortScale(data.total, 2)}
          </Text>
        </View>

        <ProgressBar progress={data.percentage} color={data.color} />
      </View>
    </View>
  );
}
