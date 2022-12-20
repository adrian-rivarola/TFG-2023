import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { List, Snackbar } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import ReportService from "../data/classes/Report";
import { convertToCSV, openCSV, saveCSV } from "../data/utils";

type SnackOptions = {
  visible: boolean;
  message: string;
  type: "error" | "success";
};

const ConfigurationScreen = () => {
  const [snackOptions, setSnackOptions] = useState<SnackOptions>({
    visible: false,
    message: "",
    type: "success",
  });
  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = {
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.onSecondary,
    },
  };

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
        setSnackOptions({
          visible: true,
          message: "El archivo fue exportado correctamente",
          type: "success",
        });
      } else {
        setSnackOptions({
          visible: true,
          message: "No se pudo guardar el archivo",
          type: "error",
        });
      }
    } catch (err) {
      setSnackOptions({
        visible: true,
        message: "Algo salió mal, por favor intente nuevamente",
        type: "error",
      });
    }
  };

  return (
    <>
      <View style={{ marginVertical: 8 }}>
        <List.Item
          title="Exportar datos a CSV"
          style={themedStyles.categoryItem}
          onPress={exportCSV}
        />
      </View>
      <Snackbar
        style={{
          backgroundColor:
            snackOptions.type === "error" ? colors.error : colors.backdrop,
        }}
        visible={snackOptions.visible}
        onDismiss={() => setSnackOptions({ ...snackOptions, visible: false })}
        action={{
          label: "OK",
          onPress: () => {
            setSnackOptions({ ...snackOptions, visible: false });
          },
        }}
      >
        {snackOptions.message}
      </Snackbar>
    </>
  );
};

export default ConfigurationScreen;

const styles = StyleSheet.create({});
