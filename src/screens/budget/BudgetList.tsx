import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import CardHeader from '@/components/CardHeader';
import CustomFAB from '@/components/CustomFAB';
import EmptyCard from '@/components/EmptyCard';
import BudgetCard from '@/components/budgets/BudgetCard';
import { useGetBudgets } from '@/hooks/budget';
import { globalStyles } from '@/theme/globalStyles';
import { RootTabScreenProps } from '@/types';

type ScreenProps = RootTabScreenProps<'BudgetList'>;

export default function BudgetListScreen({ navigation }: ScreenProps) {
  const { data: budgets, isLoading, refetch } = useGetBudgets();
  const budgetGroups = useMemo(
    () => ({
      week: budgets?.filter((b) => b.dateRange === 'week') || [],
      month: budgets?.filter((b) => b.dateRange === 'month') || [],
    }),
    [budgets]
  );

  if (!budgets) {
    return null;
  }

  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={globalStyles.screenContainer}>
          {budgets.length === 0 ? (
            <EmptyCard text="Aún no tienes ningún presupuesto" />
          ) : (
            <>
              {budgetGroups.week.length > 0 && (
                <CardHeader
                  title="Esta semana"
                  titleVariant="labelLarge"
                  style={{
                    marginBottom: 10,
                  }}
                >
                  {budgetGroups.week.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} />
                  ))}
                </CardHeader>
              )}

              {budgetGroups.month.length > 0 && (
                <CardHeader title="Este mes" titleVariant="labelLarge">
                  {budgetGroups.month.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} />
                  ))}
                </CardHeader>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <CustomFAB destination="BudgetForm" />
    </>
  );
}
