import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useQueryClient } from 'react-query';

import { Transaction, clearAllData } from '../data';
import { createMockData } from '../data/mock';
import { useModalStore } from '../store/modalStore';
import { useTheme } from '../theme/ThemeContext';
import { RootTabScreenProps } from '../types';
import { convertToCSV, saveCSV } from '../utils/csvUtils';

type ScreenProps = RootTabScreenProps<'Configuration'>;

const ConfigurationScreen = ({ navigation }: ScreenProps) => {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const showConfirmationModal = useModalStore((state) => state.showConfirmationModal);
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
      paddingStart: 20,
    },
  });

  const exportCSV = async () => {
    const transactions = await Transaction.find();
    const cleanedTransactions = transactions.map((t) => ({
      description: t.description,
      amount: t.amount,
      type: t.category.isExpense ? 'Expense' : 'Income',
      category: t.category.name,
      date: dayjs(t.date).format('YYYY-MM-DD'),
    }));

    const csvData = convertToCSV(cleanedTransactions, [
      'description',
      'amount',
      'type',
      'category',
      'date',
    ]);

    try {
      const saved = await saveCSV('transactions.csv', csvData);
      if (saved) {
        // TODO: don't show this on iOS if share is canceled
        showSnackMessage({
          message: 'El archivo fue exportado correctamente',
          type: 'success',
        });
      } else {
        showSnackMessage({
          message: 'No se pudo guardar el archivo',
          type: 'error',
        });
      }
    } catch (err) {
      console.warn('Failed to export data', err);

      showSnackMessage({
        message: 'Algo salió mal, por favor intente nuevamente',
        type: 'error',
      });
    }
  };

  const clearData = async () => {
    showConfirmationModal({
      content: 'Está seguro que quiere eliminar todos los datos registrados en esta aplicación?',
      confirmText: 'Eliminar todo',
      onConfirm: () => {
        clearAllData().then(() => {
          queryClient.resetQueries();
          showSnackMessage({
            message: 'Los datos fueron eliminados correctamente',
            type: 'success',
          });
        });
      },
    });
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <List.Section title="Categorías">
        <List.Item
          title="Crear Categoría"
          style={themedStyles.categoryItem}
          onPress={() => {
            navigation.navigate('CategoryForm');
          }}
        />
        <List.Item
          title="Ver Categorías"
          style={themedStyles.categoryItem}
          onPress={() => {
            navigation.navigate('CategoryList', {
              action: 'edit',
            });
          }}
        />
      </List.Section>

      <List.Section title="Apariencia">
        <List.Item
          title="Modo oscuro"
          style={themedStyles.categoryItem}
          right={() => <Switch value={isDarkTheme} onValueChange={toggleThemeType} />}
          onPress={toggleThemeType}
        />
      </List.Section>
      <List.Section title="Datos">
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
      </List.Section>

      <List.Section title="Pruebas">
        <List.Item
          title="Probar Componentes"
          style={themedStyles.categoryItem}
          onPress={() => {
            navigation.navigate('TestComponents');
          }}
        />
        <List.Item
          title="Insertar datos de prueba"
          style={themedStyles.categoryItem}
          onPress={() => {
            createMockData()
              .then(({ categories, transactions }) => {
                queryClient.resetQueries();
                showSnackMessage({
                  message: `Se crearon ${categories} categorías y ${transactions} transacciones`,
                  type: 'success',
                });
              })
              .catch((err) => {
                console.log(err);
                showSnackMessage({
                  message: 'Algo salió mal :(',
                  type: 'error',
                });
              });
          }}
        />
      </List.Section>
    </View>
  );
};

export default ConfigurationScreen;
