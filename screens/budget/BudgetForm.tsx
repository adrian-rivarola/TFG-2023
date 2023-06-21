import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { useQuery } from "react-query";

import AmountInput from "../../components/AmountInput";
import CategorySelect from "../../components/category/CategorySelect";
import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Budget } from "../../data";
import { useSaveBudget } from "../../hooks/budget/useSaveBudget";
import { useMainStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";

type ScreenProps = RootStackScreenProps<"BudgetForm">;
type DateRangeOption = "week" | "month";

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);

  const { mutateAsync: saveBudget } = useSaveBudget();

  const budgetId = route.params?.budgetId;
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeOption>("week");

  // TODO: improve this
  useQuery(
    ["budgets-edit", budgetId],
    () => Budget.findOneByOrFail({ id: budgetId }),
    {
      enabled: !!budgetId,
      onSuccess: onBudgetLoad,
      onError: (err) => {
        console.log(`Transaction with id ${budgetId} not found`);
        navigation.goBack();
      },
    }
  );

  useEffect(() => {
    return () => setSelectedCategories([]);
  }, []);

  function onBudgetLoad(budget: Budget) {
    setDescription(budget.description);
    setMaxAmount(budget.maxAmount);
    setDateRange(budget.dateRange);
    setSelectedCategories(budget.categories);
  }

  const onSubmit = () => {
    const budget = Budget.create({
      description: description,
      maxAmount: maxAmount,
      categories: selectedCategories,
      dateRange: dateRange,
      id: budgetId,
    });

    saveBudget(budget)
      .then(() => {
        const message = budgetId
          ? "Presupuesto actualizado correctamente"
          : "Presupuesto creado correctamente";
        showSnackMessage({
          message,
          type: "success",
        });

        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: "Algo salió mal, intente de nuevo",
          type: "error",
        });
        console.error(err);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Periodo:</Text>
          <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
            <Chip
              onPress={() => setDateRange("week")}
              // selected={dateRange === "week"}
              // icon={"calendar-today"}
              style={{
                marginEnd: 10,
                borderColor: theme.colors.primaryContainer,
                borderWidth: 2,
                backgroundColor:
                  dateRange === "week"
                    ? theme.colors.primaryContainer
                    : theme.colors.surface,
              }}
            >
              Semana
            </Chip>
            <Chip
              onPress={() => setDateRange("month")}
              // selected={dateRange === "month"}
              style={{
                borderColor: theme.colors.primaryContainer,
                borderWidth: 2,
                backgroundColor:
                  dateRange === "month"
                    ? theme.colors.primaryContainer
                    : theme.colors.surface,
              }}
              // icon={"calendar-today"}
            >
              Mes
            </Chip>
          </View>
          {/* <SegmentedButtons
            density="medium"
            value={dateRange}
            onValueChange={(value) => setDateRange(value as DateRangeOption)}
            buttons={[
              {
                value: "week",
                label: "Semana",
              },
              {
                value: "month",
                label: "Mes",
              },
            ]}
          /> */}
        </View>

        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={(val) => setDescription(val)}
          />
        </View>

        <AmountInput
          label="Monto máximo:"
          value={maxAmount}
          setValue={setMaxAmount}
        />

        <View style={styles.inputGroup}>
          <CategorySelect multiple expenseOnly label="Categorías:" />
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!description || !maxAmount || !selectedCategories.length}
          onPress={onSubmit}
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: "center",
    width: screenWidth - 100,
  },
  amountInput: {
    height: 40,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
});
