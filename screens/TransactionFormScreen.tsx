import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
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
import { useRefContext } from "../context/RefContext";
import { useTheme } from "../context/ThemeContext";
import { Transaction, dataSource } from "../data";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<
  RootTabParamList,
  "TransactionForm" | "TransactionEditForm"
>;

export default function TransactionFormScreen({
  navigation,
  route,
}: ScreenProps) {
  const transactionRepository = dataSource.getRepository(Transaction);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const { selectedCategory, selectCategory } = useMainContext();
  const { snackRef } = useRefContext();
  const { themeType, theme } = useTheme();
  const transactionId = route.params?.transactionId;

  useEffect(() => {
    if (transactionId) {
      transactionRepository
        .findOne({ where: { id: transactionId } })
        .then((transaction) => {
          if (!transaction) {
            navigation.goBack();
            console.log(`Transaction with id ${transactionId} not found`);
          } else {
            setAmount(transaction.amount.toString());
            setDescription(transaction.description);
            setDate(dayjs(transaction.date).toDate());
          }
        });
    }
  }, [transactionId]);

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

  const resetFields = () => {
    setAmount("");
    setDescription("");
    selectCategory(undefined);
    setDate(new Date());
  };

  const onSubmit = () => {
    if (transactionId) {
      transactionRepository
        .update(
          { id: transactionId },
          {
            description,
            amount: parseInt(amount, 10),
            category: selectedCategory!,
          }
        )
        .then(() => {
          snackRef.current?.showSnackMessage({
            message: "Transacción actualizada",
            type: "success",
          });
          navigation.goBack();
          resetFields();
        })
        .catch((err) => {
          snackRef.current?.showSnackMessage({
            message: "Algo salió mal, intente de nuevo",
            type: "error",
          });
          console.log(
            `Failed to update transaction with id: ${transactionId}`,
            err
          );
        });
    } else {
      const transaction = new Transaction();
      transaction.description = description;
      transaction.amount = parseInt(amount, 10);
      transaction.category = selectedCategory!;
      transaction.date = date.toISOString();

      transactionRepository
        .save(transaction)
        .then(() => {
          snackRef.current?.showSnackMessage({
            message: "Transacción creada correctamente",
            type: "success",
          });
          navigation.navigate("TransactionList");
          resetFields();
        })
        .catch((err) => {
          snackRef.current?.showSnackMessage({
            message: "Algo salió mal, intente de nuevo",
            type: "error",
          });
          console.log("Failed to create Transaction!", err);
        });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
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
          <Text>Monto:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
            value={amount}
            onChangeText={(val) => setAmount(val)}
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
          <Text style={{ marginBottom: 8 }}>Fecha:</Text>
          {datePicker}
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!amount || !description || !selectedCategory}
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
  input: {},
});
