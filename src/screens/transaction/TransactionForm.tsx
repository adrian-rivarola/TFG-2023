import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';

import CategorySelect from '@/components/category/CategorySelect';
import AmountInput from '@/components/forms/AmountInput';
import { DatePicker } from '@/components/forms/DatePicker';
import DeleteTransactionButton from '@/components/transactions/DeleteTransactionButton';
import { SCREEN_WIDTH } from '@/constants/Layout';
import { Transaction, TransactionFormData } from '@/data';
import { useSaveTransaction } from '@/hooks/transaction';
import useForm from '@/hooks/useForm';
import { useMainStore, useModalStore } from '@/store';
import { globalStyles } from '@/theme/globalStyles';
import { RootStackScreenProps } from '@/types';
import { DATE_FORMAT } from '@/utils/dateUtils';

type ScreenProps = RootStackScreenProps<'TransactionForm'>;

const DEFAULT_TRANSACTION = {
  amount: 0,
  category: 0,
  description: '',
  date: dayjs().format(DATE_FORMAT),
};

export default function TransactionFormScreen({ navigation, route }: ScreenProps) {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);
  const { mutateAsync: saveTransaction, isLoading } = useSaveTransaction();

  const [formData, onChange] = useForm<TransactionFormData>({
    ...DEFAULT_TRANSACTION,
    ...route.params?.transaction,
  });

  useEffect(() => {
    if (formData.id) {
      navigation.setOptions({
        headerRight: () => <DeleteTransactionButton transactionId={formData.id!} />,
      });
    }

    return () => setSelectedCategories([]);
  }, []);

  const handleSubmit = () => {
    const transaction = Transaction.create({
      ...formData,
      category: selectedCategories[0],
    });

    saveTransaction(transaction)
      .then((t) => {
        const message = formData.id ? 'Transacción actualizada' : 'Transacción creada';
        showSnackMessage({
          message,
          type: 'success',
        });

        navigation.goBack();
      })
      .catch((err) => {
        console.warn('Failed to save transaction', err);

        showSnackMessage({
          message: 'Error al guardar la transacción',
          type: 'error',
        });
      });
  };

  return (
    <ScrollView>
      <View style={globalStyles.formContainer}>
        <AmountInput
          label="Monto:"
          value={formData.amount}
          setValue={(val) => onChange('amount', val)}
        />

        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            mode="outlined"
            value={formData.description}
            onChangeText={(val) => onChange('description', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Fecha:</Text>
          <DatePicker
            date={dayjs(formData.date).toDate()}
            onChange={(newDate) => {
              onChange('date', dayjs(newDate).format(DATE_FORMAT));
            }}
          />
        </View>

        <View style={styles.inputGroup}>
          <CategorySelect label="Categoría:" />
        </View>

        <View style={{ marginTop: 24 }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              mode="contained"
              disabled={!formData.amount || !selectedCategories.length}
              onPress={handleSubmit}
            >
              Guardar
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: 'center',
    width: SCREEN_WIDTH - 100,
  },
});
