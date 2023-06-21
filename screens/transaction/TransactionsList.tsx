import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Between, FindOptionsWhere } from "typeorm";

import DateFilterFAB from "../../components/DateFilterFAB";
import GroupedTransactions from "../../components/transactions/GroupedTransactions";
import TransactionFilterDialog from "../../components/transactions/TransactionFilterDialog";
import { Transaction } from "../../data";
import useGetInfiniteTransactions from "../../hooks/transaction/useGetInfiniteTransactions";
import { useMainStore } from "../../store";
import { useTheme } from "../../theme/ThemeContext";
import { RootTabScreenProps } from "../../types";
import { DateRange } from "../../utils/dateUtils";
import { groupTransactionsByDate } from "../../utils/transactionUtils";

type ScreenProps = RootTabScreenProps<"TransactionList">;

export default function TransactionsListScreen({ navigation }: ScreenProps) {
  const {
    theme: { colors },
  } = useTheme();

  const activeFilters = useMainStore((store) => store.activeFilters);
  const [dateRange, setDateRange] = useState<DateRange>();
  const filters: FindOptionsWhere<Transaction> = {
    date: dateRange
      ? Between(dateRange.startDate, dateRange.endDate)
      : undefined,
  };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetInfiniteTransactions(filters);

  useEffect(() => {
    let title: string;

    if (dateRange) {
      const start = dayjs(dateRange.startDate);
      const end = dayjs(dateRange.endDate);
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

  const groupedTransactions = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page) || [];
    if (flatData.length === 0) {
      return {};
    }
    return groupTransactionsByDate(flatData);
  }, [data?.pages]);

  if (isLoading) {
    return <ActivityIndicator style={{ paddingVertical: 20 }} />;
  }
  return (
    <>
      <View>
        <GroupedTransactions
          transactions={groupedTransactions}
          onEndReached={() => {
            !isFetchingNextPage && hasNextPage && fetchNextPage();
          }}
        />
        {isFetchingNextPage && (
          <ActivityIndicator style={{ paddingVertical: 15 }} />
        )}
      </View>

      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
  );
}
