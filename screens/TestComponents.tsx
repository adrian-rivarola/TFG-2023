import { useNavigation } from "@react-navigation/native";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Balance from "../components/Balance";
import ReportsPreview from "../components/reports/ReportsPreview";
import TransactionsList from "../components/transactions/TransactionsList";
import { useTheme } from "../context/ThemeContext";

export default function TestComponents(props: {}) {
  const { toggleThemeType } = useTheme();
  const navigation = useNavigation();

  const testFooter = (
    <View style={styles.footer}>
      <Button
        mode="outlined"
        onPress={() => {
          navigation.navigate("Modal");
        }}
      >
        Open Modal
      </Button>
      <Button mode="outlined" onPress={toggleThemeType}>
        Toggle Theme
      </Button>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance balance={2_250_060} />
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
