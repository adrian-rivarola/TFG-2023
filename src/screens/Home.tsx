import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BalanceCard from '@/components/BalanceCard';
import CustomFAB from '@/components/CustomFAB';
import ExepensesChart from '@/components/reports/ExpensesChart';
import LastTransactions from '@/components/transactions/LastTransactions';
import { globalStyles } from '@/theme/globalStyles';
import { RootTabScreenProps } from '@/types';

type ScreenProps = RootTabScreenProps<'Home'>;

export default function Home({ navigation }: ScreenProps) {
  return (
    <>
      <ScrollView>
        <View style={globalStyles.screenContainer}>
          <BalanceCard />
          <View style={styles.smallSeparator} />
          <ExepensesChart />
          <View style={styles.smallSeparator} />
          <LastTransactions />
          <View style={styles.separator} />
        </View>
      </ScrollView>

      <CustomFAB destination="TransactionForm" />
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  smallSeparator: {
    marginVertical: 15,
  },
});
