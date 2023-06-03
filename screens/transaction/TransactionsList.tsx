import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Between } from "typeorm";

import DateFilterFAB from "../../components/DateFilterFAB";
import TransactionCard from "../../components/transactions/TransactionCard";
import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import { RootTabScreenProps } from "../../types";
import { StringDateRange, getDatesFromRange } from "../../utils/dateUtils";
import { groupTransactionsByRange } from "../../utils/transactionUtils";

type ScreenProps = RootTabScreenProps<"TransactionList">;

export default function TransactionsListScreen({}: ScreenProps) {
  return (
    <>
      {/* TODO: showing filters/groups options */}
      <TransactionsByDate range="week" />
    </>
  );
}

type TransactionsByDateProps = {
  range: StringDateRange;
};

function TransactionsByDate({ range }: TransactionsByDateProps) {
  const navigation = useNavigation();
  const [dateRange, setDateRange] = useState(getDatesFromRange(range));
  const { startDate, endDate } = dateRange;
  const { data, isFetching, isError, refetch } = useGetTransactions({
    where: { date: Between(startDate, endDate) },
  });

  const groupedTransactions = useMemo(
    () =>
      groupTransactionsByRange(range === "week" ? "day" : "week", data || []),
    [data]
  );

  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const dateInfo = `${start.format("DD[/]MM")} al ${end.format("DD[/]MM")}`;

    navigation.setOptions({
      title: `Transacciones - ${dateInfo}`,
    });
  }, [dateRange]);

  if (isError) {
    return null;
  }

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View style={styles.container}>
          {Object.entries(groupedTransactions).length === 0 && (
            <Text style={{ paddingVertical: 16 }}>
              Aún no hay transacciones
            </Text>
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

      {/* TODO: Move to TransactionsList comopnent */}
      <DateFilterFAB initialRange={dateRange} onChange={setDateRange} />
    </>
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
