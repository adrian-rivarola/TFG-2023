import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

import { useTheme } from "../context/ThemeContext";
import { useGetBalance } from "../hooks/balance/useGetBalance";
import { formatCurrency } from "../utils/numberFormatter";
import { useUpdateBalance } from "../hooks/balance/useUpdateBalance";
import { Balance } from "../data";

export default function BalanceCard() {
  const {
    theme: { colors },
  } = useTheme();
  const { data, isLoading } = useGetBalance();
  const { mutate: updateBalance } = useUpdateBalance();

  if (isLoading || !data) {
    return null;
  }
  const { balance, totalExpense, totalIncome } = data;

  const adjustBalance = () => {
    Alert.prompt(
      "Actualizar balance actual",
      "",
      async (text) => {
        const newBalance = parseInt(text, 10);

        if (!isNaN(newBalance)) {
          const [res] = await Balance.find({ take: 1 });
          const { initialBalance = 0 } = res || {};
          const newInitialBalance = newBalance + initialBalance - balance;
          updateBalance(newInitialBalance);
        }
      },
      "plain-text",
      balance === 0 ? "" : balance.toString(),
      "numeric"
    );
  };

  return (
    <Card elevation={1} mode="elevated" style={styles.balanceContainer}>
      <Card.Content style={{ alignContent: "center" }}>
        <Text variant="titleMedium">Balance total:</Text>
        <Text variant="displaySmall">{formatCurrency(balance)}</Text>
      </Card.Content>

      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
        }}
      >
        <IconButton
          icon="cog"
          iconColor={colors.backdrop}
          size={20}
          onPress={adjustBalance}
        />
      </View>

      <Card.Content
        style={{
          marginTop: 15,
        }}
      >
        <Text variant="titleSmall">Este mes:</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.income,
                marginEnd: 2,
                fontSize: 15,
              }}
            >
              {formatCurrency(totalIncome)}
            </Text>
            <MaterialIcons
              name="arrow-upward"
              color={colors.income}
              size={15}
            />
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
                marginStart: 2,
                fontSize: 15,
              }}
            >
              {formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  balanceContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 15,
    alignSelf: "center",
    width: screenWidth - 20,
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: 24,
  },
});
