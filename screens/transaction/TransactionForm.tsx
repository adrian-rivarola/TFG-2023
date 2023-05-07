import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { DatePicker } from "../../components/DatePicker";
import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from "../../data";
import { useSaveTransaction } from "../../hooks/transaction/useSaveTransaction";
import { useCategoryStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";

type ScreenProps = RootStackScreenProps<"TransactionForm">;

export default function TransactionFormScreen({
  navigation,
  route,
}: ScreenProps) {
  const { theme } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useCategoryStore(
    (state) => [state.selectedCategories, state.setSelectedCategories]
  );
  const { mutateAsync: saveTransaction } = useSaveTransaction();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const transactionId = route.params?.transactionId;

  useEffect(() => {
    if (transactionId) {
      Transaction.findOneByOrFail({ id: transactionId! }).then(
        onTransactionLoad
      );
    }
  }, [route]);

  function onTransactionLoad({
    amount,
    description,
    date,
    category,
  }: Transaction) {
    setAmount(amount.toString());
    setDate(dayjs(date).toDate());
    setDescription(description);
    setSelectedCategories([category]);
  }

  const resetFields = () => {
    setAmount("");
    setDescription("");
    setSelectedCategories([]);
    setDate(new Date());
  };

  const onSubmit = () => {
    const transaction = Transaction.create({
      id: transactionId,
      description,
      amount: parseInt(amount, 10),
      category: selectedCategories[0],
      date: date,
    });

    saveTransaction(transaction)
      .then((t) => {
        const message = transactionId
          ? "Transacción actualizada"
          : "Transacción creada";
        showSnackMessage({
          message,
          type: "success",
        });

        resetFields();
        navigation.replace("TransactionDetails", {
          transactionId: t.id,
        });
      })
      .catch((err) => {
        showSnackMessage({
          message: "Error al guardar la transacción",
          type: "error",
        });
      });
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
                paddingVertical: 10,
              }}
            >
              {selectedCategories.length > 0 && (
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
                {!selectedCategories.length
                  ? "Seleccionar categoría"
                  : selectedCategories[0].name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.inputGroup}>
          <Text style={{ marginBottom: 8 }}>Fecha:</Text>
          <DatePicker date={date} onChange={setDate} />
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!amount || !description || !selectedCategories.length}
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
  input: {},
});
