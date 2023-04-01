import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";
import TransactionCard from "../components/transactions/TransactionCard";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import BudgetService, { BudgetStatus } from "../data/classes/Budget";
import { RootTabParamList } from "../types";

import dataSource from "../data/data-source";
import { Budget } from "../data/entities/Budget";
import { Transaction } from "../data/entities/Transaction";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetDetails">;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function BudgetDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const budgetRepository = dataSource.getRepository(Budget);
  const [budget, setBudget] = useState<Budget>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { categories } = useMainContext();
  const {
    theme: { colors },
  } = useTheme();
  const category = budget?.category;

  useEffect(() => {
    budgetRepository
      .findOne({
        relations: ["category"],
        where: { id: route.params.budgetId },
      })
      .then((b) => {
        if (!b) {
          console.log(`Budget not found!!!`);
          navigation.goBack();
        } else {
          setBudget(b);
        }
      });

    // budgetService.getTransactions(route.params.budgetId).then(setTransactions);
  }, []);

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  const durationInfo = () => {
    const start = dayjs(budget?.startDate);
    const end = dayjs(budget?.endDate);
    // .format("D [de] MMMM");

    if (start.isSame(end, "month")) {
      return `${start.format("D")} al ${end.format("D [de] MMMM")}`;
    }
  };

  const deleteBudget = () => {
    budgetRepository.delete(route.params.budgetId).then((deleted) => {
      if (deleted.affected === 1) {
        navigation.goBack();
      } else {
        console.log("Failed to delete budget");
      }
    });
  };

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
              {/* Gs. {budget.transactionsTotal.toLocaleString()} */}
              TODO: add budget total
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
              {durationInfo()}
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
              onPress={() => {
                setDialogVisible(true);
              }}
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

        <DeleteDialog
          onDelete={deleteBudget}
          visible={dialogVisible}
          hideDialog={() => setDialogVisible(false)}
        />
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
