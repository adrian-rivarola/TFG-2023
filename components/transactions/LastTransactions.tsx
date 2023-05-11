import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import Layout from "../../constants/Layout";
import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import TransactionCard from "./TransactionCard";

export default function LastTransactions() {
  const { data: transactions, isLoading } = useGetTransactions({ take: 3 });

  if (isLoading || !transactions) {
    return null;
  }

  return (
    <View style={styles.transactionsContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Últimas transacciones</Text>
      </View>
      {transactions.length ? (
        transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <Text style={{ paddingVertical: 16 }}>Aún no hay transacciones :(</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsContainer: {
    paddingVertical: 25,
    alignItems: "center",
    alignSelf: "center",
    width: Layout.window.width - 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
});
