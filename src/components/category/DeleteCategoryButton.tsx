import React from 'react';
import { IconButton } from 'react-native-paper';

import { useDeleteCategory } from '@/hooks/category';
import { useGetTransactions } from '@/hooks/transaction';
import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

type DeleteCategoryButtonProps = {
  categoryId: number;
};

export default function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const [showSnackMessage, showConfirmationModal] = useModalStore((state) => [
    state.showSnackMessage,
    state.showConfirmationModal,
  ]);
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { data: transactions } = useGetTransactions({
    take: 1,
    where: {
      category: {
        id: categoryId,
      },
    },
  });

  if (transactions?.length) {
    return null;
  }

  return (
    <IconButton
      icon="delete"
      iconColor={theme.colors.error}
      onPress={() => {
        showConfirmationModal({
          content: 'Eliminar categoría?',
          onConfirm: async () => {
            return deleteCategory(categoryId).then(() => {
              showSnackMessage({
                message: 'Categoría eliminado',
                type: 'success',
              });
              navigation.goBack();
            });
          },
        });
      }}
    />
  );
}
