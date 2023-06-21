import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";

import CustomFAB from "../../components/CustomFAB";
import GroupedTransactions from "../../components/transactions/GroupedTransactions";
import { Transaction } from "../../data";
import { useGetBudgetsById } from "../../hooks/budget/useGetBudgetById";
import { useMainStore } from "../../store";
import { useTheme } from "../../theme/ThemeContext";
import { RootStackScreenProps } from "../../types";
import { groupTransactionsByDate } from "../../utils/transactionUtils";
import BudgetInfo from "./BudgetInfo";

type ScreenProps = RootStackScreenProps<"BudgetDetails">;

const screenWidth = Dimensions.get("screen").width;

export default function BudgetDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const { theme } = useTheme();
  const setSelectedCategories = useMainStore(
    (state) => state.setSelectedCategories
  );
  const [index, setIndex] = React.useState(0);
  const routes = [
    { key: "details", title: "Detalles" },
    { key: "transactions", title: "Transacciones" },
  ];

  const { data: budget, isLoading } = useGetBudgetsById(route.params.budgetId);

  const groupedTransactions: Record<string, Transaction[]> = useMemo(() => {
    if (!budget) {
      return {};
    }
    return groupTransactionsByDate(budget.transactions);
  }, [budget?.transactions]);

  useEffect(() => {
    if (!budget) return;

    navigation.setOptions({
      title: budget.description,
      headerRight: () => (
        <IconButton
          style={{ padding: 0, marginEnd: -10 }}
          icon={() => (
            <MaterialIcons name="edit" size={20} color={theme.colors.text} />
          )}
          onPress={() => {
            setSelectedCategories(budget.categories);
            navigation.navigate("BudgetForm", { budget: budget.serialize() });
          }}
        />
      ),
    });
  }, [budget]);

  if (isLoading || !budget) {
    return null;
  }

  return (
    <TabView
      initialLayout={{
        width: screenWidth,
      }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={({ route }) => {
        switch (route.key) {
          case "details":
            return <BudgetInfo budget={budget} />;
          case "transactions":
            return (
              <>
                <GroupedTransactions transactions={groupedTransactions} />
                <View
                  style={{
                    marginBottom: 50,
                  }}
                >
                  <CustomFAB destination="TransactionForm" />
                </View>
              </>
            );
        }
      }}
      renderTabBar={(props) => (
        <TabBar
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{ backgroundColor: theme.colors.background }}
          labelStyle={{ color: theme.colors.text }}
          {...props}
        />
      )}
    />
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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
});
