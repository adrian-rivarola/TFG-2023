import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { DatePicker } from "../components/DatePicker";
import Layout from "../constants/Layout";
import { useTheme } from "../context/ThemeContext";
import { Budget } from "../data";
import { useCreateBudget } from "../hooks/Budget/useCreateBudget";
import { useCategoryStore } from "../store";
import { useModalStore } from "../store/modalStore";
import { RootTabParamList } from "../types";
import { useQuery } from "react-query";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetForm">;

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useCategoryStore(
    (state) => [state.selectedCategories, state.setSelectedCategories]
  );

  const { mutateAsync } = useCreateBudget();

  const budgetId = route.params?.budgetId;
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useQuery(
    ["budgets-edit", budgetId],
    () => Budget.findOneByOrFail({ id: budgetId }),
    {
      enabled: !!budgetId,
      onSuccess,
      onError: (err) => {
        console.log(`Transaction with id ${budgetId} not found`);
        navigation.goBack();
      },
    }
  );

  function onSuccess(budget: Budget) {
    setDescription(budget.description);
    setMaxAmount(budget.maxAmount.toString());
    setStartDate(dayjs(budget.startDate).toDate());
    setEndDate(dayjs(budget.endDate).toDate());
    setSelectedCategories(budget.categories);
  }

  const onSubmit = () => {
    const budget = Budget.create({
      description: description,
      maxAmount: parseInt(maxAmount, 10),
      categories: selectedCategories,
      startDate: startDate,
      endDate: endDate,
      id: budgetId,
    });
    mutateAsync(budget)
      .then(() => {
        const message = budgetId
          ? "Presupuesto actualizado correctamente"
          : "Presupuesto creado correctamente";
        showSnackMessage({
          message,
          type: "success",
        });

        navigation.goBack();
        resetForm();
      })
      .catch((err) => {
        showSnackMessage({
          message: "Algo salió mal, intente de nuevo",
          type: "error",
        });
        console.error(err);
      });
  };

  const resetForm = () => {
    setDescription("");
    setMaxAmount("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedCategories([]);
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
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            value={maxAmount}
            onChangeText={(val) => setMaxAmount(val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Categoría:</Text>
          {/* TODO: move to it's own component */}
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CategorySelect", {
                multiple: true,
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

        <View style={styles.inputGroup}>
          <Text>Fecha de inicio:</Text>
          <DatePicker
            // maxDate={endDate}
            date={startDate}
            onChange={(val) => setStartDate(val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha de fin:</Text>
          <DatePicker
            date={endDate}
            // minDate={startDate}
            onChange={(val) => setEndDate(val)}
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

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
    // alignSelf: "center",
    paddingVertical: 16,
    alignContent: "center",
    width: screenWidth - 100,
  },
});
