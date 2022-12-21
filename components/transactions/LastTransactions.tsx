import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Layout from "../../constants/Layout";
import { useMainContext } from "../../context/MainContext";
import TransactionService, {
  Transaction,
} from "../../data/classes/Transaction";
import { RootTabParamList } from "../../types";
import TransactionCard from "./TransactionCard";

export default function LastTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { categories } = useMainContext();

  useEffect(() => {
    getLastTransactions();
  }, []);

  const getLastTransactions = () => {
    const transactionsService = new TransactionService();
    transactionsService
      .query({ limit: 3, page: 1 })
      .then((res) => {
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
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            category={categories.find((c) => c.id === transaction.category_id)}
          />
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
