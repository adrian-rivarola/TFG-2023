import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import Layout from "../../constants/Layout";
import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import TransactionCard from "./TransactionCard";
import { useNavigation } from "@react-navigation/native";

export default function LastTransactions() {
  const { data: transactions, isLoading } = useGetTransactions({ take: 3 });
  const navigation = useNavigation();

  if (isLoading || !transactions) {
    return null;
  }

  return (
    <View style={styles.transactionsContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          width: "100%",
        }}
      >
        <Text variant="titleMedium">Últimas transacciones</Text>
        <Button
          mode="text"
          onPress={() => {
            navigation.navigate("BottomTab", {
              screen: "TransactionList",
            });
          }}
        >
          Ver más
        </Button>
      </View>

      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
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
