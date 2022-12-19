import { View } from "react-native";
import { Card, Text, Title } from "react-native-paper";
import Layout from "../../constants/Layout";
import { useMainContext } from "../../context/MainContext";
import { Category, CategoryType } from "../../data/classes/Category";
import { Transaction } from "../../data/classes/Transaction";

type TransactionCardProps = {
  transaction: Transaction;
  category?: Category;
};

export default function TransactionCard({
  transaction,
  category,
}: TransactionCardProps) {
  const amountColor = category?.type === CategoryType.expense ? "red" : "green";

  return (
    <Card
      mode="outlined"
      style={{ marginVertical: 4, width: Layout.window.width - 50 }}
      key={transaction.id}
    >
      <Card.Title
        title={transaction.description}
        right={() => <Text variant="bodySmall">{transaction.date}</Text>}
        rightStyle={{ marginEnd: 8 }}
      />
      <Card.Content
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text
          variant="bodySmall"
          style={{
            color: amountColor,
            fontWeight: "bold",
          }}
        >
          {transaction.amount?.toLocaleString()}
        </Text>
        {category && <Text variant="bodySmall">{category.name}</Text>}
      </Card.Content>
    </Card>
  );
}
