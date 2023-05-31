import { useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import CustomFAB from "../../components/CustomFAB";
import TransactionCard from "../../components/transactions/TransactionCard";
import { useTheme } from "../../context/ThemeContext";
import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import { RootTabScreenProps } from "../../types";
import { getDatesFromRange } from "../../utils/dateUtils";
import { groupTransactionsByRange } from "../../utils/transactionGroupingUtils";
import { Between } from "typeorm";

type ScreenProps = RootTabScreenProps<"TransactionList">;

const renderScene = SceneMap({
  week: () => <TransactionsByDate range="week" />,
  month: () => <TransactionsByDate range="month" />,
});

export default function TransactionsListScreen({}: ScreenProps) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "week", title: "Esta Semana" },
    { key: "month", title: "Este Mes" },
  ]);

  return (
    <>
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
      <CustomFAB destination="TransactionForm" />
    </>
  );
}

type TransactionsByDateProps = {
  range: "week" | "month";
};

function TransactionsByDate({ range }: TransactionsByDateProps) {
  const { startDate, endDate } = useMemo(
    () => getDatesFromRange(range),
    [range]
  );
  const { data, isFetching, isError, refetch } = useGetTransactions({
    where: { date: Between(startDate, endDate) },
  });

  const groupedTransactions = useMemo(
    () =>
      groupTransactionsByRange(range === "week" ? "day" : "week", data || []),
    [data]
  );

  if (isError) {
    return null;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      <View style={styles.container}>
        {Object.entries(groupedTransactions).length === 0 && (
          <Text style={{ paddingVertical: 16 }}>Aún no hay transacciones</Text>
        )}
        {Object.entries(groupedTransactions).map(
          ([date, transactions], index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text
                variant="labelLarge"
                style={{ textTransform: "capitalize" }}
              >
                {date}
              </Text>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </View>
          )
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
