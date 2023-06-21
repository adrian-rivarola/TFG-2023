import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import AmountInput from "../../components/AmountInput";
import { DatePicker } from "../../components/DatePicker";
import CategorySelect from "../../components/category/CategorySelect";
import Layout from "../../constants/Layout";
import { Transaction, TransactionFormData } from "../../data";
import { useSaveTransaction } from "../../hooks/transaction/useSaveTransaction";
import { useMainStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";
import { DATE_FORMAT } from "../../utils/dateUtils";
import useForm from "../../hooks/useForm";

type ScreenProps = RootStackScreenProps<"TransactionForm">;

const screenWidth = Layout.window.width;

const DEFAULT_TRANSACTION = {
  amount: 0,
  category: 0,
  description: "",
  date: dayjs().format(DATE_FORMAT),
};

export default function TransactionFormScreen({
  navigation,
  route,
}: ScreenProps) {
  const [showSnackMessage, setLoading] = useModalStore((state) => [
    state.showSnackMessage,
    state.setLoading,
  ]);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);
  const { mutateAsync: saveTransaction } = useSaveTransaction();

  const [formData, onChange] = useForm<TransactionFormData>({
    ...DEFAULT_TRANSACTION,
    ...route.params?.transaction,
  });

  useEffect(() => {
    return () => {
      setSelectedCategories([]);
    };
  }, []);

  const onSubmit = () => {
    const transaction = Transaction.create({
      ...formData,
      category: selectedCategories[0],
    });

    setLoading(true);
    saveTransaction(transaction)
      .then((t) => {
        const message = formData.id
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
      })
      .finally(() => {
        setLoading(false);
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
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <AmountInput
          label="Monto:"
          value={formData.amount}
          setValue={(val) => onChange("amount", val)}
        />

        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            mode="outlined"
            value={formData.description}
            onChangeText={(val) => onChange("description", val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha:</Text>
          <DatePicker
            date={dayjs(formData.date).toDate()}
            onChange={(newDate) => {
              onChange("date", dayjs(newDate).format(DATE_FORMAT));
            }}
          />
        </View>

        <View style={styles.inputGroup}>
          <CategorySelect label="Categoría:" />
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!formData.amount || !selectedCategories.length}
          onPress={onSubmit}
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}
