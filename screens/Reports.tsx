import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { TabBar, TabView } from "react-native-tab-view";

import DateFilterFAB from "../components/DateFilterFAB";
import CategoryTypeReport from "../components/reports/CategoryTypeReport";
import { useTheme } from "../context/ThemeContext";
import { CategoryType } from "../data";
import { RootTabScreenProps } from "../types";
import { getDatesFromRange } from "../utils/dateUtils";
import Layout from "../constants/Layout";

type ScreenProps = RootTabScreenProps<"ReportsScreen">;
type ReportTabsKey = "statistics" | "expenses" | "incomes";
type ReportTabs = {
  key: ReportTabsKey;
  title: string;
};

const screenWidth = Layout.window.width;

export default function Reports({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);
  const routes: ReportTabs[] = [
    // { key: "statistics", title: "Estadísticas" },
    { key: "expenses", title: "Gastos" },
    { key: "incomes", title: "Ingresos" },
  ];
  const [dateRange, setDateRange] = useState(getDatesFromRange("week"));

  useEffect(() => {
    const start = dayjs(dateRange.startDate);
    const end = dayjs(dateRange.endDate);
    const dateInfo = `${start.format("DD[/]MM")} al ${end.format("DD[/]MM")}`;

    navigation.setOptions({
      title: `Reportes - ${dateInfo}`,
    });
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
            // case "statistics":
            //   return <StatisticsReport dateRange={dateRange} />;
            case "expenses":
              return (
                <CategoryTypeReport
                  dateRange={dateRange}
                  categoryType={CategoryType.expense}
                />
              );
            case "incomes":
              return (
                <CategoryTypeReport
                  dateRange={dateRange}
                  categoryType={CategoryType.income}
                />
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
