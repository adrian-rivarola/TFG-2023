import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import TransactionCard from "./TransactionCard";

import Layout from "../../constants/Layout";
import { useMainContext } from "../../context/MainContext";
import dataSource from "../../data/data-source";
import { Transaction } from "../../data/entities/Transaction";

export default function LastTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getLastTransactions();
  }, []);

  const getLastTransactions = () => {
    const transactionRepository = dataSource.getRepository(Transaction);
    transactionRepository
      .find({ relations: ["category"], take: 3 })
      .then(setTransactions)
      .catch((err) => {
        console.log(`Failed to get transactions`, err);
      });
  };

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
