import React from 'react';
import { IconButton } from 'react-native-paper';

import { useDeleteTransaction } from '@/hooks/transaction';
import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

type DeleteTransactionButtonProps = {
  transactionId: number;
};

export default function DeleteTransactionButton({ transactionId }: DeleteTransactionButtonProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const [showSnackMessage, showConfirmationModal] = useModalStore((state) => [
    state.showSnackMessage,
    state.showConfirmationModal,
  ]);

  return (
    <IconButton
      icon="delete"
      iconColor={theme.colors.error}
      onPress={() => {
        showConfirmationModal({
          content: 'Eliminar transacción?',
          onConfirm: async () => {
            return deleteTransaction(transactionId).then(() => {
              showSnackMessage({
                message: 'Transacción eliminada',
                type: 'success',
              });
              navigation.navigate('BottomTab', {
                screen: 'TransactionList',
              });
            });
          },
        });
      }}
    />
  );
}
