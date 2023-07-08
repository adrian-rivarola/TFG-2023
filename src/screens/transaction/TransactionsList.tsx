import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Between, FindOptionsWhere, In } from 'typeorm';

import DateFilterFAB from '@/components/DateFilterFAB';
import GroupedTransactions from '@/components/transactions/GroupedTransactions';
import { Transaction } from '@/data';
import { useGetInfiniteTransactions } from '@/hooks/transaction';
import { useMainStore } from '@/store';
import { DateRange, RootTabScreenProps } from '@/types';
import { groupTransactionsByDate } from '@/utils/transactionUtils';

type ScreenProps = RootTabScreenProps<'TransactionList'>;

export default function TransactionsListScreen({ navigation }: ScreenProps) {
  const [dateRange, setDateRange] = useState<DateRange>();
  const activeFilters = useMainStore((store) => store.activeFilters);

  const filters: FindOptionsWhere<Transaction> = {
    date: dateRange ? Between(dateRange.startDate, dateRange.endDate) : undefined,
    category: {
      type: activeFilters.categoryType,
      id: activeFilters.categories?.length ? In(activeFilters.categories) : undefined,
    },
  };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetInfiniteTransactions(filters);

  useEffect(() => {
    let title: string;

    if (dateRange) {
      const start = dayjs(dateRange.startDate);
      const end = dayjs(dateRange.endDate);
      const dateInfo = `${start.format('DD[/]MM')} al ${end.format('DD[/]MM')}`;

      title = `Transacciones - ${dateInfo}`;
    } else {
      title = 'Transacciones';
    }

    navigation.setOptions({
      title,
    });
  }, [dateRange]);

  const groupedTransactions = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page) || [];
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
        {isFetchingNextPage && <ActivityIndicator style={{ paddingVertical: 15 }} />}
      </View>

      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
  );
}
