import dayjs from "dayjs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, List } from "react-native-paper";
import { useQueryClient } from "react-query";

import { useTheme } from "../context/ThemeContext";
import { Transaction, dropDB } from "../data";
import { useModalStore } from "../store/modalStore";
import { RootTabScreenProps } from "../types";
import { convertToCSV, saveCSV } from "../utils/csvUtils";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type ScreenProps = RootTabScreenProps<"Configuration">;

const ConfigurationScreen = ({ navigation }: ScreenProps) => {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const showConfirmationModal = useModalStore(
    (state) => state.showConfirmationModal
  );
  const queryClient = useQueryClient();

  const {
    theme: { colors },
    isDarkTheme,
    toggleThemeType,
  } = useTheme();

  const themedStyles = StyleSheet.create({
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
  });

  const exportCSV = async () => {
    const transactions = await Transaction.find();
    const cleanedTransactions = transactions.map((t) => ({
      description: t.description,
      amount: t.amount,
      type: t.category.isExpense ? "Expense" : "Income",
      category: t.category.name,
      date: dayjs(t.date).format("YYYY-MM-DD"),
    }));

    const csvData = convertToCSV(cleanedTransactions, [
      "description",
      "amount",
      "type",
      "category",
      "date",
    ]);

    try {
      const saved = await saveCSV("transactions.csv", csvData);
      if (saved) {
        // TODO: don't show this on iOS if share is canceled
        showSnackMessage({
          message: "El archivo fue exportado correctamente",
          type: "success",
        });
      } else {
        showSnackMessage({
          message: "No se pudo guardar el archivo",
          type: "error",
        });
      }
    } catch (err) {
      showSnackMessage({
        message: "Algo salió mal, por favor intente nuevamente",
        type: "error",
      });
    }
  };

  const clearData = async () => {
    showConfirmationModal({
      content:
        "Está seguro que quiere eliminar todos los datos registrados en esta aplicación?",
      confirmText: "Eliminar todo",
      onConfirm: () => {
        dropDB().then(() => {
          queryClient.resetQueries();
          showSnackMessage({
            message: "Los datos fueron eliminados correctamente",
            type: "success",
          });
        });
      },
    });
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <List.Item
        title="Categories"
        style={themedStyles.categoryItem}
        onPress={() => {
          navigation.navigate("CategoryList");
        }}
      />
      <List.Item
        right={() => (
          <MaterialIcons
            name={isDarkTheme ? "lightbulb" : "nightlight-round"}
            color={colors.onBackground}
            size={15}
          />
        )}
        title="Cambiar tema"
        style={themedStyles.categoryItem}
        onPress={() => {
          toggleThemeType();
        }}
      />
      <List.Item
        title="Exportar datos a CSV"
        style={themedStyles.categoryItem}
        onPress={exportCSV}
      />
      <List.Item
        title="Borrar todos los datos"
        style={themedStyles.categoryItem}
        onPress={clearData}
      />
      <List.Item
        title="TestComponents"
        style={themedStyles.categoryItem}
        onPress={() => {
          navigation.navigate("TestComponents");
        }}
      />
    </View>
  );
};

export default ConfigurationScreen;
