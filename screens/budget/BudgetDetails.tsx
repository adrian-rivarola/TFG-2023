import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Banner, IconButton, Text } from "react-native-paper";

import BudgetPercentageBar from "../../components/budgets/BudgetPercentageBar";
import CategoryIcon from "../../components/category/CategoryIcon";
import TransactionCard from "../../components/transactions/TransactionCard";
import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../data";
import { useGetBudgetsById } from "../../hooks/budget/useGetBudgetById";
import { RootStackScreenProps } from "../../types";
import { formatCurrency } from "../../utils/numberUtils";

type ScreenProps = RootStackScreenProps<"BudgetDetails">;

const screenWidth = Dimensions.get("screen").width;

export default function BudgetDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const { theme } = useTheme();

  const { data: budget, isLoading } = useGetBudgetsById(route.params.budgetId);
  const { categories = [], transactions = [] } = budget || {};

  useEffect(() => {
    if (budget) {
      navigation.setOptions({
        title: budget.description,
        headerRight: () => (
          <IconButton
            icon={() => <MaterialIcons name="edit" size={25} />}
            onPress={() => {
              navigation.navigate("BudgetForm", { budgetId: budget.id });
            }}
          />
        ),
      });
    }
  }, [budget]);

  const getCategoryTotal = (category: Category) => {
    const total = transactions
      .filter((t) => t.category.id === category.id)
      .reduce((acc, t) => acc + t.amount, 0);

    return formatCurrency(total);
  };

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
  });

  if (isLoading || !budget) {
    return null;
  }

  const isOverLimit = budget.totalSpent > budget.maxAmount;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Banner
          visible={isOverLimit}
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

        <View
          style={[
            styles.transactionInfo,
            {
              paddingBottom: 0,
            },
          ]}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text variant="titleMedium">{budget.dateInfo}</Text>
            <BudgetPercentageBar budget={budget} />
          </View>

          <View style={[styles.categoriesContainer]}>
            <View style={{ alignSelf: "center" }}>
              <Text variant="titleMedium">Categorías:</Text>
            </View>

            {categories.map((category) => (
              <View
                key={category.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={category.id}
                >
                  <CategoryIcon category={category} />
                  <Text variant="bodyLarge" style={styles.ms2}>
                    {category?.name}
                  </Text>
                </View>

                <Text>{getCategoryTotal(category)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.budgetInfo}>
          <Text
            style={[
              styles.ms2,
              styles.mb2,
              {
                alignSelf: "center",
              },
            ]}
            variant="titleMedium"
          >
            Transacciones en este periodo:
          </Text>

          {transactions && transactions.length > 0 ? (
            transactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))
          ) : (
            <Text style={{ padding: 16 }}>
              No se ha registrado ninguna transacción para este presupuesto.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionInfo: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ms2: {
    marginStart: 10,
  },
  mb2: {
    marginBottom: 10,
  },
  amount: {
    marginTop: 15,
    marginStart: 32,
  },
  description: {
    flexDirection: "row",
    marginTop: 16,
    marginStart: 32,
  },
  budgetInfo: {
    marginTop: 16,
  },
  budgetCard: {
    marginTop: 16,
  },
  categoriesContainer: {
    marginVertical: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 16,
  },
});
