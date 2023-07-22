import { View } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';

import CardHeader from '../CardHeader';
import EmptyCard from '../EmptyCard';
import TransactionCard from './TransactionCard';
import { useGetTransactions } from '@/hooks/transaction';
import { useNavigation } from '@react-navigation/native';

export default function LastTransactions() {
  const navigation = useNavigation();
  const { data: transactions, isLoading } = useGetTransactions({
    take: 3,
  });

  return (
    <CardHeader
      title="Últimas transacciones"
      onSeeMorePress={() => {
        navigation.navigate('BottomTab', {
          screen: 'TransactionList',
        });
      }}
    >
      {transactions?.length === 0 &&
        (isLoading ? (
          <Card style={{ padding: 15, alignItems: 'center' }}>
            <ActivityIndicator />
          </Card>
        ) : (
          <EmptyCard text="Aún no hay transacciones" />
        ))}

      {transactions?.map((transaction) => (
        <View key={transaction.id} style={{ marginBottom: 10 }}>
          <TransactionCard transaction={transaction} />
        </View>
      ))}
    </CardHeader>
  );
}
