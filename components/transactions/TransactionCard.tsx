import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";

import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from "../../data";

type TransactionCardProps = {
  transaction: Transaction;
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();
  const { category } = transaction;
  const amountColor = category.isExpense
    ? colors.expenseColor
    : colors.incomeColor;

  return (
    <Card
      mode="outlined"
      style={{
        marginVertical: 4,
        width: Layout.window.width - 50,
        alignSelf: "center",
      }}
      onPress={() => {
        navigation.navigate("Root", {
          screen: "TransactionDetails",
          params: {
            transactionId: transaction.id,
          },
        });
      }}
      key={transaction.id}
    >
      <Card.Title
        title={transaction.description}
        right={() => (
          <Text
            variant="bodySmall"
            style={{
              color: amountColor,
              fontWeight: "bold",
            }}
          >
            Gs. {transaction.amount?.toLocaleString()}
          </Text>
        )}
        rightStyle={{ marginEnd: 8 }}
      />
      <Card.Content
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text variant="bodySmall">
          {dayjs(transaction.date).format("dddd, D [de] MMMM")}
        </Text>
        {category && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name={category.icon.toLowerCase() as any}
              color={colors.text}
              size={16}
              style={{ marginStart: 16 }}
            />
            <Text variant="bodySmall">{category.name}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
