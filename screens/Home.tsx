import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import BalanceCard from "../components/BalanceCard";
import CustomFAB from "../components/CustomFAB";
import ExpenseTotalsByDate from "../components/reports/ExpenseTotalsByDate";
import LastTransactions from "../components/transactions/LastTransactions";
import { RootTabScreenProps } from "../types";

type ScreenProps = RootTabScreenProps<"Home">;

export default function Home({ navigation }: ScreenProps) {
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <BalanceCard />
          <View style={styles.smallSeparator} />
          <ExpenseTotalsByDate />
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  smallSeparator: {
    marginVertical: 15,
  },
  footer: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 32,
    width: "100%",
    bottom: 8,
    left: 0,
  },
});
