import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
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
import BudgetService from "../data/classes/Budget";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetForm">;

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
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
      const budgetService = new BudgetService();
      budgetService.getById(budgetId).then((budget) => {
        if (!budget) {
          navigation.goBack();
          console.log(`Budget with id ${budgetId} not found`);
        } else {
          setDescription(budget.description);
          setMaxAmount(budget.max_amount.toString());
          setStartDate(dayjs(budget.start_date).toDate());
          setEndDate(dayjs(budget.end_date).toDate());
          setIsActive(budget.is_active);
          selectCategory(categories.find((c) => c.id === budget.category_id)!);
        }
      });
    }
  }, [budgetId]);

  const onSubmit = () => {
    const budgetService = new BudgetService();
    const budgetData = {
      description,
      max_amount: parseInt(maxAmount, 10),
      category_id: selectedCategory!.id,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      is_active: isActive,
    };

    if (budgetId) {
      budgetService
        .update(budgetId, budgetData)
        .then(() => {
          snackRef.current?.showSnackMessage({
            message: "Presupuesto actualizado correctamente",
            type: "success",
          });
          navigation.goBack();
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
        .insert(budgetData)
        .then(async (newBudget) => {
          const budgetStatus = await budgetService.addStatusToBudget(newBudget);
          setBudgets([budgetStatus, ...allBudgets]);
          snackRef.current?.showSnackMessage({
            message: "Presupuesto creado correctamente",
            type: "success",
          });
          navigation.navigate("BudgetList");
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
            <Text
              style={{
                borderColor: theme.colors.secondary,
                borderWidth: 1,
                borderRadius: 4,
                padding: 14,
              }}
            >
              {!selectedCategory
                ? "Seleccionar categoría"
                : selectedCategory.name}
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha de inicio:</Text>
          <DatePicker value={startDate} onChange={(val) => setStartDate(val)} />
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha de fin:</Text>
          <DatePicker value={endDate} onChange={(val) => setEndDate(val)} />
        </View>

        <View style={styles.inputGroup}>
          <Text>Activado:</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
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
  onChange(val: Date): void;
};
function DatePicker({ value, onChange }: DatePickerProps) {
  const { theme, themeType } = useTheme();

  return Platform.OS === "ios" ? (
    <RNDateTimePicker
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
