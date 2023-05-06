import { Dimensions, StyleSheet } from "react-native";
import { Card, Title } from "react-native-paper";

import { useGetBalance } from "../hooks/Report/useGetBalance";

export default function Balance() {
  const { data: balance, isLoading } = useGetBalance();

  if (isLoading) {
    return null;
  }

  return (
    <Card mode="outlined" style={styles.balanceContainer}>
      <Card.Content style={{ alignContent: "center" }}>
        <Title>Balance: {balance?.toLocaleString()} Gs.</Title>
      </Card.Content>
    </Card>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  balanceContainer: {
    alignSelf: "center",
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
