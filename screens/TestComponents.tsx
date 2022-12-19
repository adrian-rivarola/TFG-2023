import { useNavigation } from "@react-navigation/native";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Balance from "../components/Balance";
import ReportsPreview from "../components/reports/ReportsPreview";
import TransactionsList from "../components/transactions/TransactionsList";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";

export default function TestComponents(props: {}) {
  const { toggleThemeType } = useTheme();
  const { balance } = useMainContext();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance balance={balance} />
        <View style={styles.smallSeparator} />
        <ReportsPreview />
        <View style={styles.smallSeparator} />
        <TransactionsList />
        {/* {testFooter} */}
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
