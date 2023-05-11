import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Budget } from "../../data";
import { useGetTransactionById } from "../../hooks/transaction/UseGetTransactionById";
import { useDeleteTransaction } from "../../hooks/transaction/useDeleteTransaction";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";
import { formatCurrency } from "../../utils/numberFormatter";

type ScreenProps = RootStackScreenProps<"TransactionDetails">;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function TransactionDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const showConfirmationModal = useModalStore(
    (state) => state.showConfirmationModal
  );
  const { transactionId } = route.params;
  const { data: transaction } = useGetTransactionById(transactionId);
  const { mutateAsync } = useDeleteTransaction();

  const category = transaction?.category;
  const budgets = transaction?.budgets ?? [];

  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  const deleteTransaction = () => {
    showConfirmationModal({
      onConfirm: () => {
        mutateAsync(transactionId).then((deleted) => {
          if (deleted) {
            navigation.goBack();
            showSnackMessage({
              message: "La transacción fue eliminada correctamente",
              type: "success",
            });
          } else {
            showSnackMessage({
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
      <View style={themedStyles.bordered}>
        <View style={styles.amount}>
          <Text
            variant="headlineMedium"
            style={{
              color: category.isExpense ? colors.expense : colors.income,
            }}
          >
            {formatCurrency(transaction.amount)}
          </Text>
        </View>

        {transaction.description && (
          <View style={styles.header}>
            <MaterialIcons name="short-text" size={24} color={colors.text} />
            <Text variant="titleLarge" style={styles.ms2}>
              {transaction.description}
            </Text>
          </View>
        )}

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

        <View style={[styles.description, styles.mb2]}>
          <Button
            onPress={() => {
              navigation.navigate("TransactionForm", {
                transactionId: transaction.id,
              });
            }}
            mode="contained"
            icon="pencil"
          >
            Editar
          </Button>
          <Button
            onPress={deleteTransaction}
            style={styles.ms2}
            mode="contained"
            icon="delete"
          >
            Eliminar
          </Button>
        </View>
      </View>

      {transaction.category.isExpense && (
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
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ms2: {
    marginStart: 15,
  },
  mb2: {
    marginBottom: 15,
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
