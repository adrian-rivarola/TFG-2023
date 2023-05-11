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

import { MaskedTextInput } from "react-native-mask-text";
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

  const [amount, setAmount] = useState(0);
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
    setAmount(amount);
    setDate(dayjs(date).toDate());
    setDescription(description);
    setSelectedCategories([category]);
  }

  const onSubmit = () => {
    const transaction = Transaction.create({
      id: transactionId,
      amount,
      description,
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

        navigation.goBack();
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
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Monto:</Text>
          <MaskedTextInput
            style={styles.amountInput}
            keyboardType="numeric"
            type="currency"
            options={{
              prefix: "Gs. ",
              decimalSeparator: ",",
              groupSeparator: ".",
            }}
            value={amount.toString()}
            onChangeText={(text, rawText) => {
              setAmount(isNaN(parseInt(rawText)) ? 0 : parseInt(rawText));
            }}
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
          disabled={!amount || !selectedCategories.length}
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
  amountInput: {
    height: 40,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
});
