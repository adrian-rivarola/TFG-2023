import React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Banner, Card, Text } from 'react-native-paper';

import CardHeader from '@/components/CardHeader';
import EmptyCard from '@/components/EmptyCard';
import BudgetLineChart from '@/components/budgets/BudgetLineChart';
import BudgetProgressBar from '@/components/budgets/BudgetProgressBar';
import PeriodsBarChart from '@/components/budgets/PeriodsBarChart';
import { Budget } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { globalStyles } from '@/theme/globalStyles';
import { formatCurrency } from '@/utils/numberUtils';
import { MaterialIcons } from '@expo/vector-icons';

type BudgetDetailsProps = {
  budget: Budget;
};

export default function BudgetDetails({ budget }: BudgetDetailsProps) {
  const { theme } = useTheme();
  const { transactions = [] } = budget;

  const overspent = budget.totalSpent > budget.maxAmount;

  return (
    <ScrollView>
      <Banner
        visible={overspent}
        elevation={3}
        style={{
          backgroundColor: theme.colors.errorContainer,
          justifyContent: 'center',
          marginBottom: 10,
        }}
        icon={(props) => (
          <Avatar.Icon
            {...props}
            size={30}
            style={{
              backgroundColor: theme.colors.expense,
            }}
            icon={() => <MaterialIcons name="warning" size={15} color={theme.colors.card} />}
          />
        )}
      >
        <Text variant="bodyLarge">Se ha excedido el presupuesto!</Text>
      </Banner>

      <View style={globalStyles.screenContainer}>
        <CardHeader title="Periodo actual:">
          <Card elevation={1} style={{ marginTop: 0 }}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <Text variant="titleMedium">{budget.dateInfo}</Text>
                <Text variant="titleSmall">{formatCurrency(budget.maxAmount)}</Text>
              </View>

              <BudgetProgressBar {...budget} />
            </Card.Content>
          </Card>
        </CardHeader>

        {transactions.length === 0 && <EmptyCard style={{ marginTop: 40 }} />}

        {transactions.length > 0 && (
          <CardHeader title="Tendencia:" style={{ marginTop: 30 }}>
            <BudgetLineChart budget={budget} transactions={transactions} />
          </CardHeader>
        )}

        {budget.previousPeriods.length > 0 && (
          <CardHeader title="Periodos anteriores:" style={{ marginTop: 30 }}>
            <PeriodsBarChart budget={budget} />
          </CardHeader>
        )}

        <View style={{ padding: 15 }} />
      </View>
    </ScrollView>
  );
}
