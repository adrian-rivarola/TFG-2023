import { Dimensions, StyleSheet } from "react-native";
import { Card, Title } from "react-native-paper";

type BalanceProps = { balance: number };

export default function Balance({ balance }: BalanceProps) {
  return (
    <Card mode="outlined" style={styles.balanceContainer}>
      <Card.Content>
        <Title>Balance: Gs. {balance.toLocaleString()}</Title>
      </Card.Content>
    </Card>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  balanceContainer: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 50,
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
