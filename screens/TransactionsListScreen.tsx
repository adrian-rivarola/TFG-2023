import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import TransactionCard from "../components/transactions/TransactionCard";
import { useTheme } from "../context/ThemeContext";

import { LessThan, MoreThanOrEqual } from "typeorm";
import dataSource from "../data/data-source";
import { Transaction } from "../data/entities/Transaction";

const renderScene = SceneMap({
  week: () => <TransactionsByDate range="week" />,
  month: () => <TransactionsByDate range="month" />,
  before: () => <TransactionsByDate range="before" />,
});

export default function TransactionsListScreen(props: {}) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "week", title: "Esta Semana" },
    { key: "month", title: "Este Mes" },
    { key: "before", title: "Anteriores" },
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
  range: "week" | "month" | "before";
};

function TransactionsByDate({ range }: TransactionsByDateProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    setLoading(true);

    const transactionsRepository = dataSource.getRepository(Transaction);
    transactionsRepository
      .find({
        relations: ["category"],
        where: {
          createdAt: getDateQuery(),
        },
      })
      .then((res) => {
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

  const getDateQuery = () => {
    const today = dayjs();
    const dateOffset =
      range === "week" ? today.subtract(7, "days") : today.subtract(1, "month");
    const operationFn = range === "before" ? LessThan : MoreThanOrEqual;

    return operationFn(dateOffset.toISOString());
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getTransactions} />
      }
    >
      <View style={styles.container}>
        {transactions.length ? (
          transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text style={{ paddingVertical: 16 }}>
            Aún no hay transacciones :(
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
