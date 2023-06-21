import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import AmountInput from "../../components/AmountInput";
import { DatePicker } from "../../components/DatePicker";
import CategorySelect from "../../components/category/CategorySelect";
import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from "../../data";
import { useSaveTransaction } from "../../hooks/transaction/useSaveTransaction";
import { useMainStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";
import { DATE_FORMAT } from "../../utils/dateUtils";

type ScreenProps = RootStackScreenProps<"TransactionForm">;

const screenWidth = Layout.window.width;

export default function TransactionFormScreen({
  navigation,
  route,
}: ScreenProps) {
  const { theme } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);
  const { mutateAsync: saveTransaction } = useSaveTransaction();

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const category = selectedCategories[0];

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
      date: dayjs(date).format(DATE_FORMAT),
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
      borderColor: theme.colors.border,
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <AmountInput label="Monto:" value={amount} setValue={setAmount} />

        <View style={styles.inputGroup}>
          <Text>Fecha:</Text>
          <DatePicker date={date} onChange={setDate} />
        </View>

        <View style={styles.inputGroup}>
          <CategorySelect label="Categoría:" />
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
