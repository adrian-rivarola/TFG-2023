import { StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useTheme } from "../context/ThemeContext";
import { Budget } from "../data";
import { useGetBudgets } from "../hooks/Budget/useGetBudgets";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetList">;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { data: budgets, isLoading, isError, refetch } = useGetBudgets();

  if (isError || !budgets) {
    return null;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
          }}
        >
          {budgets.length === 0 ? (
            <Text style={{ alignSelf: "center", paddingVertical: 16 }}>
              Aún no tienes ningún presupuesto
            </Text>
          ) : (
            <BudgetList budgets={budgets} sectionTitle="Presupuestos activos" />
          )}
        </View>

        <Button
          mode="contained"
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
    alignItems: "center",
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
      {budgets.map((budget) => {
        return (
          <List.Item
            key={budget.id}
            onPress={() => {
              navigation.navigate("BudgetDetails", {
                budgetId: budget.id,
              });
            }}
            title={budget.description}
            description={budget.dateInfo}
            descriptionStyle={{ marginTop: 4 }}
            right={() => {
              return <Text>Gs. {budget.totalSpent.toLocaleString()}</Text>;
            }}
            style={themedStyles.budgetItem}
          />
        );
      })}
    </List.Section>
  );
}
