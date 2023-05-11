import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Card, Text } from "react-native-paper";

import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from "../../data";
import { formatCurrency } from "../../utils/numberFormatter";
import dayjs from "dayjs";
import { View } from "react-native";

type TransactionCardProps = {
  transaction: Transaction;
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();
  const { category } = transaction;
  const amountColor = category.isExpense ? colors.expense : colors.income;

  return (
    <Card
      mode="elevated"
      style={{
        marginVertical: 4,
        width: Layout.window.width - 20,
        alignSelf: "center",
      }}
      onPress={() => {
        navigation.navigate("TransactionDetails", {
          transactionId: transaction.id,
        });
      }}
    >
      <Card.Title
        title={category.name}
        subtitle={transaction.description}
        subtitleStyle={{ color: colors.text, opacity: 0.75 }}
        right={() => (
          <View style={{ alignItems: "flex-end" }}>
            <Text
              variant="bodyMedium"
              style={{
                color: amountColor,
                fontWeight: "bold",
              }}
            >
              {formatCurrency(transaction.amount)}
            </Text>
            <Text variant="bodySmall">
              {dayjs(transaction.date).format("D [de] MMMM")}
            </Text>
          </View>
        )}
        rightStyle={{ marginEnd: 10 }}
        left={(props) => (
          <Avatar.Icon
            {...props}
            style={{
              backgroundColor: category.isExpense
                ? colors.expense
                : colors.income,
            }}
            icon={() => (
              <MaterialIcons
                name={category.icon as any}
                size={20}
                color={colors.card}
              />
            )}
          />
        )}
      />
      {/* <Card.Content
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
      </Card.Content> */}
    </Card>
  );
}
