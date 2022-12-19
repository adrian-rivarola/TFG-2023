import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Layout from "../constants/Layout";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import { Category } from "../data/classes/Category";
import TransactionService from "../data/classes/Transaction";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<
  RootTabParamList,
  "TransactionCreate"
>;

export default function CreateTransactionScreen({
  navigation,
  route,
}: ScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>();
  const [date, setDate] = useState(new Date());
  const { themeType, theme } = useTheme();

  const { categories } = useMainContext();

  useEffect(() => {
    const selectedCategoryId = route.params?.selectedCategoryId;
    if (selectedCategoryId) {
      const newCategory = categories.find(
        (cat) => cat.id === selectedCategoryId
      );
      setCategory(newCategory);
      console.log(`Transaction category set to ${JSON.stringify(newCategory)}`);
    }
  }, [route.params]);

  const datePicker =
    Platform.OS === "ios" ? (
      <RNDateTimePicker
        themeVariant={themeType}
        value={date}
        onChange={(e, newDate) => newDate && setDate(newDate)}
        style={{
          alignSelf: "flex-start",
        }}
      />
    ) : (
      <TouchableWithoutFeedback
        onPress={() => {
          DateTimePickerAndroid.open({
            value: date,
            onChange: (e, newDate) => {
              newDate && setDate(newDate);
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
          {date.toDateString()}
        </Text>
      </TouchableWithoutFeedback>
    );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Monto:</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={amount}
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={description}
            onChangeText={(val) => setDescription(val)}
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
              {!category ? "Seleccionar categoría" : category.name}
            </Text>
          </TouchableWithoutFeedback>
          {/* <TextInput
            style={styles.input}
            mode="outlined"
            value={category}
            onChangeText={(val) => setCategory(val)}
          /> */}
        </View>
        <View style={styles.inputGroup}>
          <Text style={{ marginBottom: 8 }}>Fecha:</Text>
          {datePicker}
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!amount || !description || !category}
          onPress={() => {
            const transactionService = new TransactionService();
            transactionService
              .insert({
                date: date.toISOString().split("T")[0],
                description,
                amount: parseInt(amount, 10),
                category_id: category!.id,
              })
              .then((res) => {
                console.log(
                  `\n\nQuery run correctly:\n${JSON.stringify(res)}\n\n`
                );
              })
              .catch((err) => {
                console.log(`\n\nQuery failed:\n${JSON.stringify(err)}\n\n`);
              });
          }}
        >
          Guardar
        </Button>
        <Button
          mode="contained-tonal"
          style={{ marginTop: 32 }}
          onPress={() => {
            const transactionService = new TransactionService();
            transactionService
              .createTable()
              .then((res) => {
                console.log(
                  `\n\nQuery run correctly:\n${JSON.stringify(res)}\n\n`
                );
              })
              .catch((err) => {
                console.log(`\n\nQuery failed:\n${JSON.stringify(err)}\n\n`);
              });
          }}
        >
          Create Table
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
  input: {},
});
