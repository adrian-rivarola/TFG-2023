import { Card, Text, Title } from "react-native-paper";
import Layout from "../../constants/Layout";
import { Transaction } from "../../data/classes/Transaction";

type TransactionCardProps = {
  transaction: Transaction;
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card
      mode="outlined"
      style={{ marginTop: 2, width: Layout.window.width - 50 }}
      key={transaction.id}
    >
      <Card.Content>
        <Title style={{ fontSize: 14 }}>{transaction.description}</Title>
        <Text variant="bodySmall">{transaction.amount?.toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );
}
