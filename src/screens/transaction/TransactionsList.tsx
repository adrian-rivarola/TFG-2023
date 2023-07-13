import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Between, FindOptionsWhere, In } from 'typeorm';

import DateFilterFAB from '@/components/DateFilterFAB';
import TransactionGroup from '@/components/transactions/TransactionGroup';
import { Transaction } from '@/data';
import { useGetInfiniteTransactions } from '@/hooks/transaction';
import { useMainStore } from '@/store';
import { DateRange, RootTabScreenProps } from '@/types';
import { getDateInfo } from '@/utils/dateUtils';
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
    navigation.setOptions({
      title: dateRange ? getDateInfo(dateRange) : 'Transacciones',
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
        <TransactionGroup
          isLoading={isFetchingNextPage}
          transactions={groupedTransactions}
          onEndReached={() => {
            !isFetchingNextPage && hasNextPage && fetchNextPage();
          }}
        />
      </View>

      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
  );
}
