import dayjs from 'dayjs';
import { openURL } from 'expo-linking';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useQueryClient } from 'react-query';

import { Transaction, clearAllData } from '@/data';
import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { RootTabScreenProps } from '@/types';
import { convertToCSV, saveCSV } from '@/utils/csvUtils';

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
    sectionTitle: {
      fontWeight: 'bold',
    },
    categoryItem: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingStart: 10,
      marginTop: -1,
    },
  });

  const exportCSV = async () => {
    const transactions = await Transaction.find({
      order: {
        date: 'ASC',
      },
    });
    const cleanedTransactions = transactions.map((t) => ({
      Descipción: t.description,
      Monto: t.category.isExpense ? -t.amount : t.amount,
      Tipo: t.category.isExpense ? 'Gasto' : 'Ingreso',
      Categoría: t.category.name,
      Fecha: dayjs(t.date).format('YYYY-MM-DD'),
    }));

    const csvData = convertToCSV(cleanedTransactions, [
      'Descipción',
      'Monto',
      'Tipo',
      'Categoría',
      'Fecha',
    ]);

    try {
      const filename = `registros-${dayjs().format('YYYY-MM-DD')}.csv`;
      await saveCSV(filename, csvData);
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
      onConfirm: async () => {
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
      <List.Section title="Categorías" titleStyle={themedStyles.sectionTitle}>
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

      <List.Section title="Apariencia" titleStyle={themedStyles.sectionTitle}>
        <List.Item
          title="Modo oscuro"
          style={themedStyles.categoryItem}
          right={() => <Switch value={isDarkTheme} onValueChange={toggleThemeType} />}
          onPress={toggleThemeType}
        />
      </List.Section>

      <List.Section title="Datos" titleStyle={themedStyles.sectionTitle}>
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

      <List.Section title="Pruebas" titleStyle={themedStyles.sectionTitle}>
        <List.Item
          title="Insertar datos de prueba"
          style={themedStyles.categoryItem}
          onPress={() => {
            navigation.navigate('CreateMockData');
          }}
        />
        <List.Item
          title=""
          style={themedStyles.categoryItem}
          onPress={() => {
            openURL('https://www.youtube.com/watch?v=2qBlE2-WL60');
          }}
        />
        {/* <List.Item
          title="Probar Componentes"
          style={themedStyles.categoryItem}
          onPress={() => {
            navigation.navigate('TestComponents');
          }}
        /> */}
      </List.Section>
    </View>
  );
};

export default ConfigurationScreen;
