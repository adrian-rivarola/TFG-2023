import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { useQuery } from "react-query";

import { useTheme } from "../../context/ThemeContext";
import { Budget, CategoryType } from "../../data";
import { useSaveBudget } from "../../hooks/budget/useSaveBudget";
import { useCategoryStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";

type ScreenProps = RootStackScreenProps<"BudgetForm">;
type DateRangeOption = "week" | "month";

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useCategoryStore(
    (state) => [state.selectedCategories, state.setSelectedCategories]
  );

  const { mutateAsync: saveBudget } = useSaveBudget();

  const budgetId = route.params?.budgetId;
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
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
    setMaxAmount(budget.maxAmount.toString());
    setSelectedCategories(budget.categories);
  }

  const onSubmit = () => {
    const budget = Budget.create({
      description: description,
      maxAmount: parseInt(maxAmount, 10),
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
          <Text>Descripción:</Text>
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={(val) => setDescription(val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Monto máximo:</Text>
          <MaskedTextInput
            style={styles.amountInput}
            keyboardType="numeric"
            type="currency"
            options={{
              prefix: "Gs. ",
              decimalSeparator: ",",
              groupSeparator: ".",
            }}
            value={maxAmount}
            onChangeText={(text, rawText) => {
              setMaxAmount(isNaN(parseInt(rawText)) ? "" : rawText);
            }}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Categoría:</Text>
          {/* TODO: move to it's own component */}
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CategorySelect", {
                multiple: true,
                categoryType: CategoryType.expense,
              });
            }}
          >
            <View
              style={{
                borderColor: theme.colors.secondary,
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 4,
                paddingVertical: 10,
              }}
            >
              {selectedCategories.length === 1 && (
                <MaterialIcons
                  name={selectedCategories[0].icon.toLowerCase() as any}
                  color={theme.colors.text}
                  size={24}
                  style={{ marginStart: 8 }}
                />
              )}
              <Text
                style={{
                  alignSelf: "center",
                  marginStart: selectedCategories.length ? 8 : 16,
                  color: selectedCategories.length
                    ? theme.colors.text
                    : theme.colors.outline,
                }}
              >
                {selectedCategories.length === 0
                  ? "Seleccionar categoría"
                  : selectedCategories.length === 1
                  ? selectedCategories[0].name
                  : `${selectedCategories.map((c) => c.name).join(", ")}`}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ alignItems: "center" }}>
          <SegmentedButtons
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
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
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
