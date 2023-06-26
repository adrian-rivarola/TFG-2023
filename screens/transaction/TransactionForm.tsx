import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import CategorySelect from '../../components/category/CategorySelect';
import AmountInput from '../../components/forms/AmountInput';
import { DatePicker } from '../../components/forms/DatePicker';
import Layout from '../../constants/Layout';
import { Transaction, TransactionFormData } from '../../data';
import { useDeleteTransaction } from '../../hooks/transaction/useDeleteTransaction';
import { useSaveTransaction } from '../../hooks/transaction/useSaveTransaction';
import useForm from '../../hooks/useForm';
import { useMainStore } from '../../store';
import { useModalStore } from '../../store/modalStore';
import { globalStyles } from '../../theme/globalStyles';
import { RootStackScreenProps } from '../../types';
import { DATE_FORMAT } from '../../utils/dateUtils';

type ScreenProps = RootStackScreenProps<'TransactionForm'>;

const screenWidth = Layout.window.width;

const DEFAULT_TRANSACTION = {
  amount: 0,
  category: 0,
  description: '',
  date: dayjs().format(DATE_FORMAT),
};

export default function TransactionFormScreen({ navigation, route }: ScreenProps) {
  const [showSnackMessage, setLoading] = useModalStore((state) => [
    state.showSnackMessage,
    state.setLoading,
  ]);
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);
  const { mutateAsync: saveTransaction } = useSaveTransaction();
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();

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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    // TODO: Show confirm validation
    deleteTransaction(formData.id!).then(() => {
      navigation.goBack();
    });
  };

  const styles = StyleSheet.create({
    inputGroup: {
      flex: 1,
      paddingVertical: 16,
      alignContent: 'center',
      width: screenWidth - 100,
    },
  });

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

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!formData.amount || !selectedCategories.length}
          onPress={onSubmit}>
          Guardar
        </Button>

        {formData.id && (
          <Button mode="contained" style={{ marginTop: 24 }} onPress={handleDelete}>
            Eliminar
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
