import { ScrollView, StyleSheet, View } from "react-native";

import Balance from "../components/Balance";
import ReportsPreview from "../components/reports/ReportsPreview";
import LastTransactions from "../components/transactions/LastTransactions";
import { useMainContext } from "../context/MainContext";

export default function HomeScreen(props: {}) {
  const { balance } = useMainContext();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance balance={balance} />
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
