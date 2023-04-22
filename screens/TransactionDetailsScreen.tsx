import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useMainContext } from "../context/MainContext";
import { useRefContext } from "../context/RefContext";
import { useTheme } from "../context/ThemeContext";

import { Budget, Transaction } from "../data";
import * as budgetService from "../services/budgetService";
import * as transactionsService from "../services/transactionsService";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<
  RootTabParamList,
  "TransactionDetails"
>;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function TransactionDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const [transaction, setTransaction] = useState<Transaction>();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { activeBudgets, selectCategory } = useMainContext();
  const { confirmModalRef, snackRef } = useRefContext();
  const {
    theme: { colors },
  } = useTheme();

  const { transactionId } = route.params;
  const category = transaction?.category;
  // const budgets = activeBudgets.filter(
  //   (b) =>
  //     b.category.id === category?.id &&
  //     b.isActive &&
  //     dayjs(transaction?.date).isAfter(b.startDate) &&
  //     dayjs(transaction?.date).isBefore(b.endDate)
  // );

  useEffect(() => {
    getTransaction();
  }, []);

  const getTransaction = async () => {
    const t = await transactionsService.getTransactionById(transactionId);

    if (!t) {
      console.log(`Transaction not found!!!`);
      navigation.goBack();
      return;
    }
    setTransaction(t);

    budgetService
      .getBudgetsForTransaction(t.category.id, t.date)
      .then(setBudgets)
      .finally(() => {});
  };

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  const deleteTransaction = () => {
    confirmModalRef.current?.showConfirmationModal({
      onConfirm: () => {
        transactionsService.deleteTransaction(transactionId).then((deleted) => {
          if (deleted) {
            navigation.goBack();
            snackRef.current?.showSnackMessage({
              message: "La transacción fue eliminada correctamente",
              type: "success",
            });
          } else {
            snackRef.current?.showSnackMessage({
              message: "Algo salío mal, intente nuevamente más tarde",
              type: "error",
            });
          }
        });
      },
    });
  };

  if (!transaction || !category) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.transactionInfo, themedStyles.bordered]}>
        <View style={styles.header}>
          <MaterialIcons name="short-text" size={24} color={colors.text} />
          <Text variant="titleLarge" style={styles.ms2}>
            {transaction.description}
          </Text>
        </View>

        <View style={styles.amount}>
          <Text
            variant="headlineSmall"
            style={{
              color: category.isExpense
                ? colors.expenseColor
                : colors.incomeColor,
            }}
          >
            Gs. {transaction.amount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.description}>
          <MaterialIcons
            name={category.icon.toLowerCase() as MaterialIconName}
            color={colors.text}
            size={24}
          />
          <Text variant="bodyLarge" style={styles.ms2}>
            {category?.name}
          </Text>
        </View>

        <View style={styles.description}>
          <MaterialIcons name="calendar-today" size={24} color={colors.text} />
          <Text variant="bodyLarge" style={styles.ms2}>
            {dayjs(transaction.date).format("dddd, D [de] MMMM")}
          </Text>
        </View>

        <View style={styles.description}>
          <Button
            onPress={() => {
              selectCategory(category);
              navigation.navigate("TransactionEditForm", {
                transactionId: transaction.id,
              });
            }}
            mode="contained-tonal"
            icon="pencil"
          >
            Editar
          </Button>
          <Button
            onPress={deleteTransaction}
            style={styles.ms2}
            mode="contained-tonal"
            icon="delete"
          >
            Eliminar
          </Button>
        </View>
      </View>

      <View style={styles.budgetInfo}>
        <Text style={[styles.ms2, styles.mb2]} variant="titleMedium">
          Presupuestos:
        </Text>
        {budgets.length > 0 ? (
          budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onPress={() => {
                navigation.navigate("BudgetDetails", {
                  budgetId: b.id,
                });
              }}
            />
          ))
        ) : (
          <Text style={{ padding: 16 }}>
            Esta categoría no pertenece a ningún presupuesto.
          </Text>
        )}
      </View>
    </View>
  );
}

type BudgetCardProps = {
  budget: Budget;
  onPress(): void;
};

function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = {
    budgetItem: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.onSecondary,
    },
  };

  return (
    <List.Item
      key={budget.id}
      onPress={onPress}
      title={budget.description}
      description={budget.dateInfo}
      descriptionStyle={{ marginTop: 4 }}
      right={() => {
        return <Text>Gs. {budget.totalSpent?.toLocaleString()}</Text>;
      }}
      style={themedStyles.budgetItem}
    />
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
    marginStart: 16,
  },
  mb2: {
    marginBottom: 16,
  },
  amount: {
    marginTop: 16,
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
});
