import React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Banner, Card, Text } from 'react-native-paper';

import EmptyCard from '@/components/EmptyCard';
import BudgetLineChart from '@/components/budgets/BudgetLineChart';
import BudgetProgressBar from '@/components/budgets/BudgetProgressBar';
import PeriodsBarChart from '@/components/budgets/PeriodsBarChart';
import { Budget } from '@/data';
import { useTheme } from '@/theme/ThemeContext';
import { globalStyles } from '@/theme/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';

type BudgetInfoProps = {
  budget: Budget;
};

export default function BudgetInfo({ budget }: BudgetInfoProps) {
  const { theme } = useTheme();
  const { transactions = [] } = budget;

  const overspent = budget.totalSpent > budget.maxAmount;

  return (
    <ScrollView>
      <View style={globalStyles.screenContainer}>
        <Banner
          visible={overspent}
          elevation={3}
          style={{
            backgroundColor: theme.colors.errorContainer,
            justifyContent: 'center',
          }}
          icon={(props) => (
            <Avatar.Icon
              {...props}
              size={30}
              style={[
                {
                  backgroundColor: theme.colors.expense,
                },
              ]}
              icon={() => <MaterialIcons name="warning" size={15} color={theme.colors.card} />}
            />
          )}
        >
          <Text variant="bodyLarge">Se ha excedido el presupuesto!</Text>
        </Banner>

        <View>
          <Text
            style={{
              marginBottom: 10,
            }}
            variant="titleMedium"
          >
            Periodo actual:
          </Text>

          <Card elevation={1} style={{ marginTop: 0 }}>
            <Card.Content>
              <Text variant="labelLarge">{budget.dateInfo}</Text>
              <BudgetProgressBar {...budget} />
            </Card.Content>
          </Card>
        </View>

        {transactions.length === 0 && <EmptyCard style={{ marginTop: 40 }} />}

        {transactions.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                marginBottom: 10,
              }}
              variant="titleMedium"
            >
              Tendencia:
            </Text>

            <BudgetLineChart budget={budget} transactions={transactions} />
          </View>
        )}

        {budget.previousPeriods.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                marginBottom: 10,
              }}
              variant="titleMedium"
            >
              Periodos anteriores:
            </Text>

            <PeriodsBarChart budget={budget} />
          </View>
        )}

        <View style={{ padding: 15 }} />
      </View>
    </ScrollView>
  );
}
