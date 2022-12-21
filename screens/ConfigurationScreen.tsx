import React, { useState } from "react";
import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { List, Snackbar } from "react-native-paper";
import ConfirmationModal, { ModalRef } from "../components/ConfirmationModal";
import SnackbarMessage, { SnackRef } from "../components/SnackbarMessage";
import { useMainContext } from "../context/MainContext";
import { useRefContext } from "../context/RefContext";
import { useTheme } from "../context/ThemeContext";
import ReportService from "../data/classes/Report";
import { clearAllData } from "../data/migrations";
import { convertToCSV, saveCSV } from "../data/utils";

type SnackOptions = {
  visible: boolean;
  message: string;
  type: "error" | "success";
};

const ConfigurationScreen = () => {
  const { confirmModalRef, snackRef } = useRefContext();
  const { setCategories } = useMainContext();
  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = StyleSheet.create({
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
  });

  const exportCSV = async () => {
    const reportService = new ReportService();
    const transactions = await reportService.getTransactionsWithCategory();

    const csvData = convertToCSV(transactions, [
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
        snackRef.current?.showSnackMessage({
          message: "El archivo fue exportado correctamente",
          type: "success",
        });
      } else {
        snackRef.current?.showSnackMessage({
          message: "No se pudo guardar el archivo",
          type: "error",
        });
      }
    } catch (err) {
      snackRef.current?.showSnackMessage({
        message: "Algo salió mal, por favor intente nuevamente",
        type: "error",
      });
    }
  };

  const clearData = async () => {
    confirmModalRef.current?.showConfirmationModal({
      content:
        "Está seguro que quiere eliminar todos los datos registrados en esta aplicación?",
      confirmText: "Eliminar todo",
      onConfirm: () => {
        clearAllData().then((deleted) => {
          if (deleted) {
            setCategories([]);
            snackRef.current?.showSnackMessage({
              message: "Los datos fueron eliminados correctamente",
              type: "success",
            });
          } else {
            snackRef.current?.showSnackMessage({
              message: "Algo salío mal, intente nuevamente más tarde",
              type: "error",
            });
          }
        });
      },
    });
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <List.Item
        title="Exportar datos a CSV"
        style={themedStyles.categoryItem}
        onPress={exportCSV}
      />
      <List.Item
        title="Borrar todos los datos"
        underlayColor={colors.error}
        style={themedStyles.categoryItem}
        onPress={clearData}
      />
    </View>
  );
};

export default ConfigurationScreen;

const styles = StyleSheet.create({});
