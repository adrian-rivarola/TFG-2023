import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Banner, Card, Text } from "react-native-paper";

import BudgetLineChart from "../../components/budgets/BudgetLineChart";
import BudgetProgressBar from "../../components/budgets/BudgetProgressBar";
import { Budget } from "../../data";
import { useTheme } from "../../theme/ThemeContext";
import { globalStyles } from "../../theme/globalStyles";

type BudgetInfoProps = {
  budget: Budget;
};

export default function BudgetInfo({ budget }: BudgetInfoProps) {
  const { theme } = useTheme();
  const { transactions = [] } = budget;

  const overspent = budget.totalSpent > budget.maxAmount;

  return (
    <ScrollView>
      <View style={globalStyles.screenContainer}>
        <Banner
          visible={overspent}
          elevation={3}
          style={{
            backgroundColor: theme.colors.errorContainer,
            justifyContent: "center",
          }}
          icon={(props) => (
            <Avatar.Icon
              {...props}
              size={30}
              style={[
                {
                  backgroundColor: theme.colors.expense,
                },
              ]}
              icon={() => (
                <MaterialIcons
                  name={"warning"}
                  size={15}
                  color={theme.colors.card}
                />
              )}
            />
          )}
        >
          <Text variant="bodyLarge">Se ha excedido el presupuesto!</Text>
        </Banner>

        <Card elevation={1} style={{ marginTop: 20 }}>
          <Card.Content>
            <Text variant="labelLarge">{budget.dateInfo}</Text>
            <BudgetProgressBar budget={budget} />
          </Card.Content>
        </Card>

        {transactions.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                marginBottom: 10,
              }}
              variant="titleMedium"
            >
              Tendencia:
            </Text>

            <BudgetLineChart budget={budget} transactions={transactions} />
          </View>
        )}

        <View style={{ padding: 15 }} />
      </View>
    </ScrollView>
  );
}
