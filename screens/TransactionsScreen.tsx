import { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import TransactionCard from "../components/transactions/TransactionCard";
import { useTheme } from "../context/ThemeContext";
import TransactionService, { Transaction } from "../data/classes/Transaction";

const transactionsService = new TransactionService();

const renderScene = SceneMap({
  week: () => <TransactionsByDate range="week" />,
  month: () => <TransactionsByDate range="month" />,
});

export default function TransactionsScreen(props: {}) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "week", title: "Esta Semana" },
    { key: "month", title: "Este Mes" },
  ]);

  return (
    <TabView
      renderTabBar={(props) => (
        <TabBar
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{ backgroundColor: theme.colors.background }}
          labelStyle={{ color: theme.colors.text }}
          {...props}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={(sceneProps) => {
        return renderScene(sceneProps);
      }}
      onIndexChange={setIndex}
      initialLayout={{
        width: Dimensions.get("screen").width,
      }}
      lazy
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

type TransactionsByDateProps = {
  range: "week" | "month";
};
function TransactionsByDate({ range }: TransactionsByDateProps) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    setLoading(true);

    const minDate = getMinDate();
    transactionsService
      .query({
        where: {
          createdAt: {
            gte: minDate,
          },
        },
      })
      .then((res) => {
        console.log(`Found ${res.length} transactions in range '${range}'`);
        setTransactions(res);
      })
      .catch((err) => {
        setTransactions([]);
        console.log(
          `Failed to get transactions in range ${range}: ${JSON.stringify(err)}`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMinDate = () => {
    const minDate = new Date();
    minDate.setHours(0);
    minDate.setMinutes(0);

    if (range === "week") {
      minDate.setDate(minDate.getDate() - 7);
    } else {
      minDate.setMonth(minDate.getMonth() - 1);
    }

    return minDate;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getTransactions} />
      }
    >
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </ScrollView>
  );
}
