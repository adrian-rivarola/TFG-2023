import React from 'react';
import { IconButton } from 'react-native-paper';

import { useDeleteBudget } from '@/hooks/budget';
import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

type DeleteBudgetIconProps = {
  budgetId: number;
};

export default function DeleteBudgetButton({ budgetId }: DeleteBudgetIconProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const { mutateAsync: deleteBudget } = useDeleteBudget();
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
          content: 'Eliminar presupuesto?',
          onConfirm: async () => {
            return deleteBudget(budgetId).then(() => {
              showSnackMessage({
                message: 'Presupuesto eliminado',
                type: 'success',
              });
              navigation.navigate('BottomTab', {
                screen: 'BudgetList',
              });
            });
          },
        });
      }}
    />
  );
}
