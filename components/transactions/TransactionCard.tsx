import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Card, Text } from "react-native-paper";

import Layout from "../../constants/Layout";
import { useTheme } from "../../theme/ThemeContext";
import { Transaction } from "../../data";
import { formatCurrency } from "../../utils/numberUtils";
import dayjs from "dayjs";
import { View } from "react-native";
import CategoryIcon from "../category/CategoryIcon";
import { useMainStore } from "../../store";

type TransactionCardProps = {
  transaction: Transaction;
  hideDate?: boolean;
};

export default function TransactionCard({
  transaction,
  hideDate,
}: TransactionCardProps) {
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();
  const setSelectedCategories = useMainStore(
    (state) => state.setSelectedCategories
  );
  const { category } = transaction;
  const amountColor = category.isExpense ? colors.expense : colors.income;

  return (
    <Card
      elevation={1}
      onPress={() => {
        setSelectedCategories([transaction.category]);
        navigation.navigate("TransactionForm", {
          transaction: transaction.serialize(),
        });
      }}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CategoryIcon category={category} />

          <View style={{ marginStart: 10 }}>
            <Text variant="labelLarge">{category.name}</Text>
            {transaction.description && (
              <Text
                variant="bodySmall"
                style={{ color: colors.text, opacity: 0.75 }}
              >
                {transaction.description}
              </Text>
            )}
          </View>

          <View style={{ flexGrow: 1 }} />

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

            {!hideDate && (
              <Text variant="bodySmall">
                {dayjs(transaction.date).format("D [de] MMMM")}
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
