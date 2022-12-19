import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Layout from "../../constants/Layout";
import TransactionService, {
  Transaction,
} from "../../data/classes/Transaction";
import TransactionCard from "./TransactionCard";

type TransactionsListProps = {};

const transactionsService = new TransactionService();

export default function TransactionsList(props: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getLastTransactions();
  }, []);

  const getLastTransactions = () => {
    transactionsService
      .query({ limit: 2, page: 1 })
      .then((res) => {
        console.log(`Found ${res.length} transactions`);
        setTransactions(res);
      })
      .catch((err) => {
        console.log(`Failed to get transactions`, err);
      });
  };

  return (
    <View style={styles.transactionsContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Últimas transacciones</Text>
        <IconButton icon="refresh" onPress={getLastTransactions} />
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
    width: Layout.window.width - 50,
  },
  reportWitdh: {
    width: Layout.window.width - 50,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
});
