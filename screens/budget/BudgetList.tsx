import { useNavigation } from "@react-navigation/native";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Budget } from "../../data";
import { useGetBudgets } from "../../hooks/budget/useGetBudgets";
import { RootTabScreenProps } from "../../types";
import CustomFAB from "../../components/CustomFAB";
import { formatCurrency } from "../../utils/numberFormatter";

type ScreenProps = RootTabScreenProps<"BudgetList">;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { data: budgets, isLoading, isError, refetch } = useGetBudgets();

  if (isError || !budgets) {
    return null;
  }

  return (
    <>
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
              <BudgetList
                budgets={budgets}
                sectionTitle="Presupuestos activos"
              />
            )}
          </View>
        </View>
      </ScrollView>
      <CustomFAB destination="BudgetForm" />
    </>
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
      // title={sectionTitle}
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
            right={() => <Text>{formatCurrency(budget.totalSpent)}</Text>}
            style={themedStyles.budgetItem}
          />
        );
      })}
    </List.Section>
  );
}
