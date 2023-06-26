import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { useGetTransactions } from '../../hooks/transaction/useGetTransactions';
import TransactionCard from './TransactionCard';

export default function LastTransactions() {
  const { data: transactions, isLoading } = useGetTransactions({
    take: 3,
  });
  const navigation = useNavigation();

  if (isLoading) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text variant="titleMedium">Últimas transacciones</Text>

        <Button
          mode="text"
          onPress={() => {
            navigation.navigate('BottomTab', {
              screen: 'TransactionList',
            });
          }}>
          Ver más
        </Button>
      </View>

      {transactions?.length === 0 && (
        <Card style={{ padding: 20, alignItems: 'center' }}>
          <Text variant="titleSmall">Aún no hay transacciones</Text>
        </Card>
      )}
      {transactions?.map((transaction) => (
        <View key={transaction.id} style={{ marginBottom: 10 }}>
          <TransactionCard transaction={transaction} />
        </View>
      ))}
    </View>
  );
}
