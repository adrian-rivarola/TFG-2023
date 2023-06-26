import React from 'react';
import { SectionList, View } from 'react-native';
import { Text } from 'react-native-paper';

import TransactionCard from './TransactionCard';
import { Transaction } from '../../data';
import { useTheme } from '../../theme/ThemeContext';

type GroupedTransactionsProps = {
  transactions: Record<string, Transaction[]>;
  onEndReached?: () => void;
};

export default function GroupedTransactions({
  transactions,
  onEndReached,
}: GroupedTransactionsProps) {
  const { theme } = useTheme();

  return (
    <SectionList
      stickySectionHeadersEnabled
      sections={Object.entries(transactions).map(([key, data]) => {
        return { key, data };
      })}
      keyExtractor={(item) => `${item.id}`}
      ListEmptyComponent={
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <Text variant="bodyMedium">No hay transacciones en este periodo</Text>
        </View>
      }
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
          }}>
          <Text variant="labelLarge">{info.section.key}</Text>
        </View>
      )}
      renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
      onEndReached={onEndReached}
    />
  );
}
