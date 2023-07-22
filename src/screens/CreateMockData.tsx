import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { useQueryClient } from 'react-query';

import { RootStackScreenProps } from '../../types';
import { DatePicker } from '../components/forms/DatePicker';
import CustomChip from '@/components/CustomChip';
import { MockOptions, createMockData } from '@/data/mock';
import { useModalStore } from '@/store';
import { globalStyles } from '@/theme/globalStyles';
import { DATE_FORMAT } from '@/utils/dateUtils';

type ScreenProps = RootStackScreenProps<'CreateMockData'>;

export default function CreateMockData({ navigation }: ScreenProps) {
  const queryClient = useQueryClient();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [mockOptions, setMockOptions] = useState<MockOptions>({
    categories: true,
    transactions: true,
    budgets: true,
    maxDailyTransactions: 3,
    dateRange: {
      startDate: dayjs().subtract(3, 'months').format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT),
    },
  });

  const createData = () => {
    setIsLoading(true);
    createMockData(mockOptions)
      .then(({ categories, transactions, budgets }) => {
        queryClient.resetQueries();
        showSnackMessage({
          message: `Datos creados: \n- ${categories} categorías: \n- ${transactions} transacciones \n- ${budgets} presupuestos`,
          type: 'success',
        });
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        showSnackMessage({
          message: 'Algo salió mal :(',
          type: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View style={globalStyles.formContainer}>
        <View
          style={[
            globalStyles.inputGroup,
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
          ]}
        >
          <CustomChip disabled selected style={styles.chipStyle}>
            Categorías
          </CustomChip>

          <CustomChip
            selected={mockOptions.transactions}
            style={styles.chipStyle}
            onPress={() =>
              setMockOptions({
                ...mockOptions,
                transactions: !mockOptions.transactions,
              })
            }
          >
            Transacciones
          </CustomChip>

          <CustomChip
            selected={mockOptions.budgets}
            style={styles.chipStyle}
            onPress={() =>
              setMockOptions({
                ...mockOptions,
                budgets: !mockOptions.budgets,
              })
            }
          >
            Presupuestos
          </CustomChip>
        </View>

        <View style={globalStyles.inputGroup}>
          <TextInput
            keyboardType="numeric"
            label="Transacciones por día"
            mode="outlined"
            value={String(mockOptions.maxDailyTransactions)}
            onChangeText={(val) => {
              setMockOptions({
                ...mockOptions,
                maxDailyTransactions: Number(val),
              });
            }}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text>Desde:</Text>
          <DatePicker
            date={dayjs(mockOptions.dateRange.startDate).toDate()}
            onChange={(newDate) => {
              setMockOptions({
                ...mockOptions,
                dateRange: {
                  ...mockOptions.dateRange,
                  startDate: dayjs(newDate).format(DATE_FORMAT),
                },
              });
            }}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text>Hasta:</Text>
          <DatePicker
            date={dayjs(mockOptions.dateRange.endDate).toDate()}
            onChange={(newDate) => {
              setMockOptions({
                ...mockOptions,
                dateRange: {
                  ...mockOptions.dateRange,
                  endDate: dayjs(newDate).format(DATE_FORMAT),
                },
              });
            }}
          />
        </View>

        <View style={{ marginTop: 30, width: 150, alignSelf: 'center' }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button mode="contained" onPress={createData}>
              Crear datos
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chipStyle: {
    margin: 5,
  },
});
