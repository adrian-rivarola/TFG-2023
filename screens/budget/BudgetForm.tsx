import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, IconButton, Text, TextInput } from "react-native-paper";
import { useQuery } from "react-query";

import AmountInput from "../../components/AmountInput";
import CategorySelect from "../../components/category/CategorySelect";
import Layout from "../../constants/Layout";
import { useTheme } from "../../theme/ThemeContext";
import { Budget, BudgetFormData } from "../../data";
import { useDeleteBudget } from "../../hooks/budget/useDeleteBudget";
import { useSaveBudget } from "../../hooks/budget/useSaveBudget";
import { useMainStore } from "../../store";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";
import DateRangeSelector from "../../components/DateRangeSelector";
import useForm from "../../hooks/useForm";

type ScreenProps = RootStackScreenProps<"BudgetForm">;
type DateRangeOption = "week" | "month";

const DEFAULT_BUDGET: BudgetFormData = {
  categories: [],
  dateRange: "week",
  description: "",
  maxAmount: 0,
};

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const { theme } = useTheme();
  const [showSnackMessage, showConfirmationModal, setLoading] = useModalStore(
    (state) => [
      state.showSnackMessage,
      state.showConfirmationModal,
      state.setLoading,
    ]
  );
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);

  const { mutateAsync: saveBudget } = useSaveBudget();
  const { mutateAsync: deleteBudget } = useDeleteBudget();

  const [formData, onChange] = useForm<BudgetFormData>({
    ...DEFAULT_BUDGET,
    ...route.params?.budget,
  });

  useEffect(() => {
    if (formData.id) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon={"delete"}
            iconColor={theme.colors.error}
            onPress={() => {
              showConfirmationModal({
                onConfirm: () => {
                  deleteBudget(formData.id!).then(() => {
                    showSnackMessage({
                      message: "Presupuesto eliminado",
                      type: "success",
                    });
                    navigation.navigate("BottomTab", {
                      screen: "BudgetList",
                    });
                  });
                },
              });
            }}
          />
        ),
      });
    }

    return () => setSelectedCategories([]);
  }, []);

  const onSubmit = () => {
    const budget = Budget.create({
      ...formData,
      categories: selectedCategories,
    });

    setLoading(true);
    saveBudget(budget)
      .then(() => {
        const message = formData.id
          ? "Presupuesto actualizado correctamente"
          : "Presupuesto creado correctamente";
        showSnackMessage({
          message,
          type: "success",
        });

        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: "Algo salió mal, intente de nuevo",
          type: "error",
        });
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <AmountInput
          label="Monto máximo:"
          value={formData.maxAmount}
          setValue={(val) => onChange("maxAmount", val)}
        />

        <View style={styles.inputGroup}>
          <Text>Nombre:</Text>
          <TextInput
            mode="outlined"
            value={formData.description}
            onChangeText={(val) => onChange("description", val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Periodo:</Text>

          <View style={{ marginTop: 5 }}>
            <DateRangeSelector
              value={formData.dateRange}
              onChange={(val) => onChange("dateRange", val)}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <CategorySelect multiple expenseOnly label="Categorías:" />
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={
            !formData.description ||
            !formData.maxAmount ||
            !selectedCategories.length
          }
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
    marginBottom: 80,
  },
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: "center",
    width: screenWidth - 100,
  },
  amountInput: {
    height: 40,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
});
