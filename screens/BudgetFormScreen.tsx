import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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
import { RootTabParamList } from "../types";

import dataSource from "../data/data-source";
import { Budget } from "../data/entities/Budget";
import dayjs from "dayjs";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetForm">;

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const budgetRepository = dataSource.getRepository(Budget);
  const { snackRef } = useRefContext();
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isActive, setIsActive] = useState(true);
  const {
    selectedCategory,
    categories,
    allBudgets,
    setBudgets,
    selectCategory,
  } = useMainContext();
  const { theme } = useTheme();

  const budgetId = route.params?.budgetId;

  useEffect(() => {
    if (budgetId) {
      budgetRepository
        .findOne({ relations: ["category"], where: { id: budgetId } })
        .then((budget) => {
          if (!budget) {
            navigation.goBack();
            console.log(`Budget with id ${budgetId} not found`);
          } else {
            setDescription(budget.description);
            setMaxAmount(budget.maxAmount.toString());
            setStartDate(dayjs(budget.startDate).toDate());
            setEndDate(dayjs(budget.endDate).toDate());
            setIsActive(budget.isActive);
            selectCategory(budget.category);
          }
        });
    }
  }, [budgetId]);

  const onSubmit = () => {
    const budgetData = {
      description,
      maxAmount: parseInt(maxAmount, 10),
      category: selectedCategory!,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      isActive: isActive,
    };

    if (budgetId) {
      budgetRepository
        .update(budgetId, budgetData)
        .then(() => {
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
      const budget = new Budget();
      budget.description = description;
      budget.maxAmount = parseInt(maxAmount, 10);
      budget.category = selectedCategory!;
      budget.startDate = startDate.toISOString().split("T")[0];
      budget.endDate = endDate.toISOString().split("T")[0];
      budget.isActive = isActive;

      budgetRepository
        .save(budget)
        .then(async (newBudget) => {
          // const budgetStatus = await budgetService.addStatusToBudget(newBudget);
          // setBudgets([budgetStatus, ...allBudgets]);
          console.log(JSON.stringify({ newBudget }, undefined, 2));
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
                paddingVertical: 14,
              }}
            >
              {selectedCategory?.id && (
                <MaterialIcons
                  name={selectedCategory.icon.toLowerCase() as any}
                  color={theme.colors.text}
                  size={16}
                  style={{ marginStart: 16 }}
                />
              )}
              <Text
                style={{
                  marginStart: 16,
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
