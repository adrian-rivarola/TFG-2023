import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";

import TransactionCard from "../components/transactions/TransactionCard";
import { useMainContext } from "../context/MainContext";
import { useRefContext } from "../context/RefContext";
import { useTheme } from "../context/ThemeContext";
import { Transaction } from "../data";
import * as budgetService from "../services/budgetService";
import * as transactionsService from "../services/transactionsService";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetDetails">;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function BudgetDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { allBudgets, setBudgets } = useMainContext();
  const { confirmModalRef, snackRef } = useRefContext();
  const {
    theme: { colors },
  } = useTheme();

  const budget = allBudgets.find(
    (budget) => budget.id === route.params.budgetId
  );
  const category = budget?.category;

  useEffect(() => {
    if (budget) {
      budget.getTotalSpent();
      transactionsService
        .getTransactionsByCategory(
          budget.category.id,
          budget.startDate,
          budget.endDate
        )
        .then(setTransactions)
        .catch((err) => {
          console.error("Failed to get transactions: ", err);
        });
    } else {
      console.warn("Budget not found!");
      navigation.goBack();
    }
  }, []);

  const deleteBudget = () => {
    confirmModalRef.current?.showConfirmationModal({
      onConfirm: () => {
        budgetService.deleteBudget(budget!.id).then((deleted) => {
          if (deleted) {
            setBudgets(allBudgets.filter((b) => b.id !== budget!.id));
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

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  if (!budget || !category) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.transactionInfo, themedStyles.bordered]}>
          <View style={styles.header}>
            <MaterialIcons name="short-text" size={24} color={colors.text} />
            <Text variant="titleLarge" style={styles.ms2}>
              {budget.description}
            </Text>
          </View>

          <View style={styles.amount}>
            <Text>Monto establecido:</Text>
            <Text variant="headlineSmall">
              Gs. {budget.maxAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.amount}>
            <Text>Monto utilizado:</Text>
            <Text variant="headlineSmall">
              Gs. {budget.totalSpent.toLocaleString()}
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
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={colors.text}
            />
            <Text variant="bodyLarge" style={styles.ms2}>
              {budget.dateInfo}
            </Text>
          </View>

          <View style={styles.description}>
            <Button
              onPress={() => {
                navigation.navigate("BudgetForm", {
                  budgetId: budget.id,
                });
              }}
              mode="contained-tonal"
              icon="pencil"
            >
              Editar
            </Button>
            <Button
              onPress={deleteBudget}
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
            Transacciones incluidas en este presupuesto:
          </Text>

          {transactions.length > 0 ? (
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

type DialogProps = {
  visible: boolean;
  hideDialog(): void;
  onDelete(): void;
};

function DeleteDialog({ visible, hideDialog, onDelete }: DialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>Está seguro que quiere eliminar este elemento?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
            }}
          >
            Cancelar
          </Button>
          <Button
            onPress={() => {
              hideDialog();
              onDelete();
            }}
          >
            Eliminar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
