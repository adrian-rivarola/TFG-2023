import { ScrollView, StyleSheet, View } from "react-native";

import React from "react";
import Balance from "../components/Balance";
import ReportsPreview from "../components/reports/ReportsPreview";
import LastTransactions from "../components/transactions/LastTransactions";
import { RootTabScreenProps } from "../types";

type ScreenProps = RootTabScreenProps<"Home">;

export default function Home({ navigation }: ScreenProps) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance />
        <View style={styles.smallSeparator} />
        <ReportsPreview />
        <View style={styles.smallSeparator} />
        <LastTransactions />
      </View>
    </ScrollView>
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
