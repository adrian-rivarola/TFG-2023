import React, { useEffect, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';

import DateFilterFAB from '@/components/DateFilterFAB';
import CategoryTypeReport from '@/components/category/CategoryTypeReport';
import Layout from '@/constants/Layout';
import { CategoryType } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { DateRange, RootTabScreenProps } from '@/types';
import { getDateInfo, getDatesFromRange } from '@/utils/dateUtils';

type ScreenProps = RootTabScreenProps<'ReportsScreen'>;
type ReportTabsKey = 'expenses' | 'incomes';
type ReportTabs = {
  key: ReportTabsKey;
  title: string;
};

const screenWidth = Layout.window.width;

export default function Reports({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);
  const routes: ReportTabs[] = [
    { key: 'expenses', title: 'Gastos' },
    { key: 'incomes', title: 'Ingresos' },
  ];
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDatesFromRange('month'));

  useEffect(() => {
    if (dateRange) {
      navigation.setOptions({
        title: `Reportes - ${getDateInfo(dateRange)}`,
      });
    } else {
      navigation.setOptions({
        title: 'Reportes',
      });
    }
  }, [dateRange]);

  return (
    <>
      <TabView
        initialLayout={{
          width: screenWidth,
        }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'expenses':
              return (
                <CategoryTypeReport dateRange={dateRange} categoryType={CategoryType.expense} />
              );
            case 'incomes':
              return (
                <CategoryTypeReport dateRange={dateRange} categoryType={CategoryType.income} />
              );
          }
        }}
        renderTabBar={(props) => (
          <TabBar
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
            labelStyle={{ color: theme.colors.text }}
            {...props}
          />
        )}
      />

      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
  );
}
