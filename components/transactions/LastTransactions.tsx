import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { useGetTransactions } from "../../hooks/transaction/useGetTransactions";
import TransactionCard from "./TransactionCard";

export default function LastTransactions() {
  const { data: transactions, isLoading } = useGetTransactions({
    take: 3,
  });
  const navigation = useNavigation();

  if (isLoading || !transactions) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
        <View key={transaction.id} style={{ marginBottom: 10 }}>
          <TransactionCard transaction={transaction} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
});
