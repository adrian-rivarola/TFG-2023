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
import { LessThan, MoreThanOrEqual } from "typeorm";

import TransactionCard from "../components/transactions/TransactionCard";
import { useTheme } from "../context/ThemeContext";
import { Transaction } from "../data";
import * as transactionsService from "../services/transactionsService";
import { useIsFocused } from "@react-navigation/native";

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

type TransactionsByDateProps = {
  range: "week" | "month" | "before";
};

function TransactionsByDate({ range }: TransactionsByDateProps) {
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getTransactions();
    }
  }, [isFocused]);

  const getTransactions = () => {
    setLoading(true);

    transactionsService
      .getTransactionByDate(range)
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
