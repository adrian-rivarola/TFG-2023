import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";

import Layout from "../constants/Layout";
import { useMainContext } from "../context/MainContext";
import { useRefContext } from "../context/RefContext";
import { useTheme } from "../context/ThemeContext";
import { Budget } from "../data";
import * as budgetService from "../services/budgetService";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetForm">;

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const { snackRef } = useRefContext();
  const { allBudgets, selectedCategory, selectCategory, setBudgets } =
    useMainContext();
  const { theme } = useTheme();
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isActive, setIsActive] = useState(true);
  const totalSpent = useRef(0);

  const budgetId = route.params?.budgetId;

  useEffect(() => {
    if (budgetId) {
      const budget = allBudgets.find((b) => b.id === budgetId);
      if (budget) {
        setDescription(budget.description);
        setMaxAmount(budget.maxAmount.toString());
        setStartDate(dayjs(budget.startDate).toDate());
        setEndDate(dayjs(budget.endDate).toDate());
        setIsActive(budget.isActive);
        selectCategory(budget.category);
        totalSpent.current = budget.totalSpent;
      } else {
        navigation.goBack();
        console.log(`Budget with id ${budgetId} not found`);
      }
    }
  }, [budgetId]);

  const onSubmit = () => {
    const budget = new Budget();
    budget.description = description;
    budget.maxAmount = parseInt(maxAmount, 10);
    budget.category = selectedCategory!;
    budget.startDate = startDate;
    budget.endDate = endDate;
    budget.isActive = isActive;

    if (budgetId) {
      budget.id = budgetId;
      budgetService
        .updateBudget(budgetId, budget)
        .then(() => {
          budget.totalSpent = totalSpent.current;
          setBudgets(allBudgets.map((b) => (b.id === budgetId ? budget : b)));

          snackRef.current?.showSnackMessage({
            message: "Presupuesto actualizado correctamente",
            type: "success",
          });
          navigation.goBack();
          resetForm();
        })
        .catch((err) => {
          snackRef.current?.showSnackMessage({
            message: "Algo salió mal, intente de nuevo",
            type: "error",
          });
          console.log(`Failed to update budget with id: ${budgetId}`, err);
        });
    } else {
      budgetService
        .createBudget(budget)
        .then(async (newBudget) => {
          setBudgets([...allBudgets, budget]);

          snackRef.current?.showSnackMessage({
            message: "Presupuesto creado correctamente",
            type: "success",
          });
          navigation.navigate("BudgetList");
          resetForm();
        })
        .catch((err) => {
          snackRef.current?.showSnackMessage({
            message: "Algo salió mal, intente de nuevo",
            type: "error",
          });
          console.log("Failed to create Budget!", err);
        });
    }
  };

  const resetForm = () => {
    setDescription("");
    setMaxAmount("");
    setStartDate(new Date());
    setEndDate(new Date());
    setIsActive(true);
    selectCategory(undefined);
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
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CategorySelect");
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
              {selectedCategory?.id && (
                <MaterialIcons
                  name={selectedCategory.icon.toLowerCase() as any}
                  color={theme.colors.text}
                  size={24}
                  style={{ marginStart: 8 }}
                />
              )}
              <Text
                style={{
                  alignSelf: "center",
                  marginStart: selectedCategory ? 8 : 16,
                  color: selectedCategory
                    ? theme.colors.text
                    : theme.colors.outline,
                }}
              >
                {!selectedCategory
                  ? "Seleccionar categoría"
                  : selectedCategory.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha de inicio:</Text>
          <DatePicker value={startDate} onChange={(val) => setStartDate(val)} />
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha de fin:</Text>
          <DatePicker
            value={endDate}
            minDate={startDate}
            onChange={(val) => setEndDate(val)}
          />
        </View>

        <View
          style={[
            styles.inputGroup,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text>Activado:</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            style={{ marginStart: 8 }}
          />
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!description || !maxAmount || !selectedCategory}
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

type DatePickerProps = {
  value: Date;
  minDate?: Date;
  onChange(val: Date): void;
};
function DatePicker({ value, minDate, onChange }: DatePickerProps) {
  const { theme, themeType } = useTheme();

  return Platform.OS === "ios" ? (
    <RNDateTimePicker
      minimumDate={minDate}
      themeVariant={themeType}
      value={value}
      onChange={(e, newDate) => newDate && onChange(newDate)}
      style={{
        alignSelf: "flex-start",
      }}
    />
  ) : (
    <TouchableWithoutFeedback
      onPress={() => {
        DateTimePickerAndroid.open({
          value,
          minimumDate: minDate,
          onChange: (e, newDate) => {
            newDate && onChange(newDate);
          },
        });
      }}
    >
      <Text
        style={{
          borderColor: theme.colors.secondary,
          borderWidth: 1,
          borderRadius: 4,
          padding: 14,
        }}
      >
        {value.toDateString()}
      </Text>
    </TouchableWithoutFeedback>
  );
}
