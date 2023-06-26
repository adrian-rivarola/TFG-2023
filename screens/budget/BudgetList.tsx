import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

import CustomFAB from '../../components/CustomFAB';
import { BudgetGroup } from '../../components/budgets/BudgetGroup';
import { useGetBudgets } from '../../hooks/budget/useGetBudgets';
import { globalStyles } from '../../theme/globalStyles';
import { RootTabScreenProps } from '../../types';

type ScreenProps = RootTabScreenProps<'BudgetList'>;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { data: budgets, isLoading, isError, refetch } = useGetBudgets();

  if (isError || !budgets) {
    return null;
  }

  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={globalStyles.screenContainer}>
          {budgets.length === 0 ? (
            <Text style={{ alignSelf: 'center', paddingVertical: 15 }}>
              Aún no tienes ningún presupuesto
            </Text>
          ) : (
            <>
              <BudgetGroup
                budgets={budgets.filter((b) => b.dateRange === 'week')}
                title="Esta semana"
              />
              <BudgetGroup
                budgets={budgets.filter((b) => b.dateRange === 'month')}
                title="Este mes"
              />
            </>
          )}
        </View>
      </ScrollView>
      <CustomFAB destination="BudgetForm" />
    </>
  );
}
