import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';

import DateRangeSelector from '@/components/DateRangeSelector';
import DeleteBudgetButton from '@/components/budgets/DeleteBudgetButton';
import CategorySelect from '@/components/category/CategorySelect';
import AmountInput from '@/components/forms/AmountInput';
import Layout from '@/constants/Layout';
import { Budget, BudgetFormData, CategoryType } from '@/data';
import { useSaveBudget } from '@/hooks/budget';
import useForm from '@/hooks/useForm';
import { useMainStore, useModalStore } from '@/store';
import { globalStyles } from '@/theme/globalStyles';
import { RootStackScreenProps } from '@/types';

type ScreenProps = RootStackScreenProps<'BudgetForm'>;

const DEFAULT_BUDGET: BudgetFormData = {
  categories: [],
  dateRange: 'week',
  description: '',
  maxAmount: 0,
};

export default function BudgetFormScreen({ navigation, route }: ScreenProps) {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);

  const { mutateAsync: saveBudget, isLoading } = useSaveBudget();
  const [formData, onChange] = useForm<BudgetFormData>({
    ...DEFAULT_BUDGET,
    ...route.params?.budget,
  });

  useEffect(() => {
    if (formData.id) {
      navigation.setOptions({
        headerRight: () => <DeleteBudgetButton budgetId={formData.id!} />,
      });
    }

    return () => setSelectedCategories([]);
  }, []);

  const handleSubmit = () => {
    const budget = Budget.create({
      ...formData,
      categories: selectedCategories,
    });

    saveBudget(budget)
      .then(() => {
        const message = formData.id
          ? 'Presupuesto actualizado correctamente'
          : 'Presupuesto creado correctamente';
        showSnackMessage({
          message,
          type: 'success',
        });

        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: 'Algo salió mal, intente de nuevo',
          type: 'error',
        });
        console.error(err);
      });
  };

  return (
    <ScrollView>
      <View style={globalStyles.formContainer}>
        <AmountInput
          label="Monto máximo:"
          value={formData.maxAmount}
          setValue={(val) => onChange('maxAmount', val)}
        />

        <View style={styles.inputGroup}>
          <Text>Nombre:</Text>
          <TextInput
            mode="outlined"
            value={formData.description}
            onChangeText={(val) => onChange('description', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Periodo:</Text>

          <View style={{ marginTop: 5 }}>
            <DateRangeSelector
              value={formData.dateRange}
              onChange={(val) => onChange('dateRange', val)}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <CategorySelect label="Categorías:" categoryType={CategoryType.expense} multiple />
        </View>

        <View style={{ marginTop: 24 }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              mode="contained"
              disabled={!formData.description || !formData.maxAmount || !selectedCategories.length}
              onPress={handleSubmit}
            >
              Guardar
            </Button>
          )}
        </View>

        <View
          style={{
            marginBottom: 80,
          }}
        />
      </View>
    </ScrollView>
  );
}

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: 'center',
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
