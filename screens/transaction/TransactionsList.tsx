import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { Between } from "typeorm";

import DateFilterFAB from "../../components/DateFilterFAB";
import TransactionCard from "../../components/transactions/TransactionCard";
import TransactionFilterDialog from "../../components/transactions/TransactionFilterDialog";
import { useTheme } from "../../context/ThemeContext";
import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import { useMainStore } from "../../store";
import { RootTabScreenProps } from "../../types";
import { DateRange } from "../../utils/dateUtils";
import { groupTransactionsByRange } from "../../utils/transactionUtils";

type ScreenProps = RootTabScreenProps<"TransactionList">;

export default function TransactionsListScreen({ navigation }: ScreenProps) {
  const {
    theme: { colors },
  } = useTheme();
  const activeFilters = useMainStore((store) => store.activeFilters);
  const [dateRange, setDateRange] = useState<DateRange>();
  const { startDate, endDate } = dateRange || {};
  const { data, isLoading } = useGetTransactions({
    where: {
      date: startDate && endDate ? Between(startDate, endDate) : undefined,
    },
  });
  const groupRange = "day";

  const groupedTransactions = useMemo(
    () => (data ? groupTransactionsByRange(data, groupRange) : []),
    [data]
  );

  useEffect(() => {
    let title: string;

    if (dateRange) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const dateInfo = `${start.format("DD[/]MM")} al ${end.format("DD[/]MM")}`;

      title = `Transacciones - ${dateInfo}`;
    } else {
      title = "Transacciones";
    }

    navigation.setOptions({
      title,
      headerRight: () => <TransactionFilterDialog />,
    });
  }, [dateRange]);

  if (isLoading) {
    return <ActivityIndicator style={{ paddingVertical: 20 }} />;
  }
  return (
    <>
      {data?.length === 0 && (
        <View style={{ paddingVertical: 20, alignItems: "center" }}>
          <Text variant="bodyMedium">
            No hay transacciones en este periodo de tiempo
          </Text>
        </View>
      )}

      {/* <Text variant="bodyLarge">
        {JSON.stringify(activeFilters, undefined, 2)}
      </Text> */}

      <View
        style={{
          marginTop: 15,
        }}
      />

      <SectionList
        sections={Object.entries(groupedTransactions).map(([key, data]) => {
          return { key, data };
        })}
        renderItem={({ item }) => (
          <TransactionCard transaction={item} key={item.id} />
        )}
        renderSectionHeader={(info) => (
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 20,
              backgroundColor: colors.background,
            }}
          >
            <Text variant="labelLarge" style={{ textTransform: "capitalize" }}>
              {info.section.key}
            </Text>
          </View>
        )}
        renderSectionFooter={() => <View style={{ marginBottom: 15 }} />}
        stickyHeaderHiddenOnScroll={false}
      />

      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
