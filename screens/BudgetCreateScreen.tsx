import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
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
import { useTheme } from "../context/ThemeContext";
import BudgetService from "../data/classes/Budget";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "BudgetCreate">;

export default function BudgetCreateScreen({ navigation }: ScreenProps) {
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isActive, setIsActive] = useState(true);

  const {
    selectedCategory,
    allBudgets: budgets,
    setBudgets,
  } = useMainContext();
  const { theme } = useTheme();

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
          onPress={() => {
            const budgetService = new BudgetService();
            budgetService
              .insert({
                description,
                max_amount: parseInt(maxAmount, 10),
                category_id: selectedCategory!.id,
                start_date: startDate.toISOString().split("T")[0],
                end_date: endDate.toISOString().split("T")[0],
                is_active: isActive,
              })
              .then(async (newBudget) => {
                const budgetStatus = await budgetService.addStatusToBudget(
                  newBudget
                );
                setBudgets([budgetStatus, ...budgets]);
                console.log("Budget created!");
                navigation.navigate("Planning");
              })
              .catch((err) => {
                console.log("Failed to create Budget!", err);
              });
          }}
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
