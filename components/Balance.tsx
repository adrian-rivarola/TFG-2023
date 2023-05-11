import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

import { useTheme } from "../context/ThemeContext";
import { useGetBalance } from "../hooks/report/useGetBalance";
import { formatCurrency } from "../utils/numberFormatter";

export default function Balance() {
  const {
    theme: { colors },
  } = useTheme();
  const { data, isLoading } = useGetBalance();

  if (isLoading || !data) {
    return null;
  }
  const balance = data.incomeTotal - data.expenseTotal;

  return (
    <Card mode="elevated" style={styles.balanceContainer}>
      <Card.Content style={{ alignContent: "center" }}>
        <Text variant="labelLarge">Balance total:</Text>
        <Text variant="displaySmall">{formatCurrency(balance)}</Text>
      </Card.Content>

      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 10,
        }}
      >
        <Text variant="labelLarge">Este mes:</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <MaterialIcons name="arrow-upward" color={colors.income} size={15} />
          <Text
            style={{
              color: colors.income,
              fontSize: 15,
            }}
          >
            {data.incomeTotal.toLocaleString()} Gs.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <MaterialIcons
            name="arrow-downward"
            color={colors.expense}
            size={15}
          />
          <Text
            style={{
              color: colors.expense,
            }}
          >
            -{data.expenseTotal.toLocaleString()} Gs.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  balanceContainer: {
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 15,
    alignSelf: "center",
    width: screenWidth - 20,
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: 24,
  },
});
