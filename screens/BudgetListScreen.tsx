import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import BudgetService, { BudgetStatus } from "../data/classes/Budget";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetList">;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { activeBudgets, inactiveBudgets, setBudgets } = useMainContext();
  const [loading, setLoading] = useState(false);

  const updateBudgets = () => {
    const budgetService = new BudgetService();

    budgetService.query().then(async (budgetList) => {
      const budgets = await Promise.all(
        budgetList.map((b) => budgetService.addStatusToBudget(b))
      );
      setBudgets(budgets);
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={updateBudgets} />
      }
    >
      <View style={styles.container}>
        {activeBudgets.length === 0 && inactiveBudgets.length === 0 && (
          <Text style={{ alignSelf: "center", paddingVertical: 16 }}>
            Aún no tienes ningún presupuesto
          </Text>
        )}
        {activeBudgets.length > 0 && (
          <BudgetList
            budgets={activeBudgets}
            sectionTitle="Presupuestos activos"
          />
        )}
        {inactiveBudgets.length > 0 && (
          <BudgetList
            budgets={inactiveBudgets}
            sectionTitle="Presupuestos inactivos"
          />
        )}
        <Button
          mode="contained-tonal"
          style={{ marginTop: 16 }}
          icon="plus"
          onPress={() => {
            navigation.navigate("BudgetForm");
          }}
        >
          Agregar nuevo presupuesto
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 14,
  },
  header: {
    marginStart: 14,
  },
});

type BudgetListProps = {
  sectionTitle: string;
  budgets: BudgetStatus[];
};

function BudgetList({ budgets, sectionTitle }: BudgetListProps) {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation();

  const themedStyles = {
    budgetItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.onSecondary,
    },
  };

  return (
    <List.Section
      title={sectionTitle}
      titleStyle={{
        fontWeight: "bold",
      }}
    >
      {budgets.length > 0 ? (
        budgets.map((budget) => {
          return (
            <List.Item
              key={budget.id}
              onPress={() => {
                navigation.navigate("Root", {
                  screen: "BudgetDetails",
                  params: {
                    budgetId: budget.id,
                  },
                });
              }}
              title={budget.description}
              description={`${budget.start_date} al ${budget.end_date}`
                .replaceAll("2022-", "")
                .replaceAll("-", "/")}
              descriptionStyle={{ marginTop: 4 }}
              right={() => {
                return (
                  <Text>
                    {`${budget.transactionsTotal.toLocaleString()} / ${budget.max_amount.toLocaleString()}`}
                  </Text>
                );
              }}
              style={themedStyles.budgetItem}
            />
          );
        })
      ) : (
        <Text style={{ alignSelf: "center", paddingVertical: 16 }}>
          No hay presupuestos activos :(
        </Text>
      )}
    </List.Section>
  );
}
