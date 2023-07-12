import { Dayjs } from 'dayjs';
import React from 'react';
import { SectionList, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import EmptyCard from '../EmptyCard';
import TransactionCard from './TransactionCard';
import { Transaction } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { getGroupLabel } from '@/utils/dateUtils';

type GroupedTransactionsProps = {
  isLoading?: boolean;
  transactions: Map<Dayjs, Transaction[]>;
  onEndReached?: () => void;
};

export default function GroupedTransactions({
  isLoading,
  transactions,
  onEndReached,
}: GroupedTransactionsProps) {
  const { theme } = useTheme();

  return (
    <SectionList
      stickySectionHeadersEnabled
      sections={[...transactions.entries()].map(([date, transactions]) => {
        return { key: getGroupLabel(date), data: transactions };
      })}
      keyExtractor={(item) => `${item.id}`}
      ListEmptyComponent={<EmptyCard style={{ margin: 10 }} />}
      renderItem={({ item }) => (
        <View key={item.id} style={{ marginHorizontal: 10, marginVertical: 5 }}>
          <TransactionCard transaction={item} hideDate />
        </View>
      )}
      renderSectionHeader={(info) => (
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: theme.colors.background,
          }}
        >
          <Text variant="labelLarge">{info.section.key}</Text>
        </View>
      )}
      renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
      ListFooterComponent={isLoading ? <ActivityIndicator style={{ paddingVertical: 15 }} /> : null}
      onEndReached={onEndReached}
    />
  );
}
