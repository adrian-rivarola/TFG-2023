import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import BudgetService, { BudgetStatus } from "../data/classes/Budget";
import { RootTabParamList } from "../types";
import { Budget } from "../data/entities/Budget";
import dataSource from "../data/data-source";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetList">;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { activeBudgets, inactiveBudgets, setBudgets } = useMainContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateBudgets();
  }, []);

  const updateBudgets = () => {
    const budgetRepository = dataSource.getRepository(Budget);
    budgetRepository.find({ relations: ["category"] }).then(setBudgets);
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
    // alignItems: "center",
  },
  header: {
    marginStart: 14,
  },
});

type BudgetListProps = {
  sectionTitle: string;
  budgets: Budget[];
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
              description={`${dayjs(budget.startDate).format("D")} al ${dayjs(
                budget.endDate
              ).format("D [de] MMMM")}`}
              descriptionStyle={{ marginTop: 4 }}
              right={() => {
                return (
                  <Text>
                    TODO: add budget total
                    {/* {`${budget.transactionsTotal.toLocaleString()} / ${budget.max_amount.toLocaleString()}`} */}
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
