import { ScrollView, StyleSheet, View } from "react-native";

import React from "react";
import BalanceCard from "../components/BalanceCard";
import ReportsPreview from "../components/reports/ReportsPreview";
import LastTransactions from "../components/transactions/LastTransactions";
import { RootTabScreenProps } from "../types";
import CustomFAB from "../components/CustomFAB";
import DateFilterFAB from "../components/DateFilterFAB";

type ScreenProps = RootTabScreenProps<"Home">;

export default function Home({ navigation }: ScreenProps) {
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <BalanceCard />
          <View style={styles.smallSeparator} />
          <ReportsPreview />
          <View style={styles.smallSeparator} />
          <LastTransactions />
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
    marginVertical: 10,
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
