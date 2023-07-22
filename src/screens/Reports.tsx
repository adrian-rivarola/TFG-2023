import React, { useEffect, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';

import DateFilterFAB from '@/components/DateFilterFAB';
import CategoryTypeReport from '@/components/category/CategoryTypeReport';
import { SCREEN_WIDTH } from '@/constants/Layout';
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

export default function Reports({ navigation }: ScreenProps) {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDatesFromRange('month'));
  const routes: ReportTabs[] = [
    { key: 'expenses', title: 'Gastos' },
    { key: 'incomes', title: 'Ingresos' },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: dateRange ? `Reportes - ${getDateInfo(dateRange)}` : 'Reportes',
    });
  }, [dateRange]);

  return (
    <>
      <TabView
        initialLayout={{
          width: SCREEN_WIDTH,
        }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={({ route }) => {
          const categoryType =
            route.key === 'expenses' ? CategoryType.expense : CategoryType.income;
          return <CategoryTypeReport dateRange={dateRange} categoryType={categoryType} />;
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
