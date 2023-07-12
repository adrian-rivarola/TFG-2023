import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';

import IconSelector from '@/components/IconSelector';
import CategoryTypeSelector from '@/components/category/CategoryTypeSelector';
import DeleteCategoryButton from '@/components/category/DeleteCategoryButton';
import Layout from '@/constants/Layout';
import { Category, CategoryFormData, CategoryType } from '@/data';
import { useSaveCategory } from '@/hooks/category';
import { useGetTransactions } from '@/hooks/transaction';
import useForm from '@/hooks/useForm';
import { useModalStore } from '@/store';
import { globalStyles } from '@/theme/globalStyles';
import { RootStackScreenProps } from '@/types';

type ScreenProps = RootStackScreenProps<'CategoryForm'>;

const DEFAULT_CATEGORY: CategoryFormData = {
  name: '',
  icon: 'add',
  type: CategoryType.expense,
};

export default function CategoryForm({ navigation, route }: ScreenProps) {
  const { mutateAsync: saveCategory, isLoading } = useSaveCategory();
  const [showSnackMessage, showConfirmationModal] = useModalStore((state) => [
    state.showSnackMessage,
    state.showConfirmationModal,
  ]);

  const [formData, onChange] = useForm({
    ...DEFAULT_CATEGORY,
    ...route.params?.category,
  });

  const { data: transactions } = useGetTransactions(
    {
      take: 1,
      where: {
        category: {
          id: formData?.id || 0,
        },
      },
    },
    formData.id !== undefined
  );
  const hasTransactions = transactions === undefined ? true : transactions.length > 0;

  useEffect(() => {
    if (formData.id && !hasTransactions) {
      navigation.setOptions({
        headerRight: () => <DeleteCategoryButton categoryId={formData.id!} />,
      });
    }
  }, [hasTransactions]);

  const handleSubmit = async () => {
    const category = await Category.findOne({
      where: {
        name: formData.name,
      },
      withDeleted: true,
    });

    if (category === null && !hasTransactions) {
      return handleCreate();
    }

    showConfirmationModal({
      onConfirm: handleCreate,
      content: hasTransactions
        ? 'Ya existen transacciones creadas con esta categoría, desea actualizar de todas formas? '
        : `Ya existe una categoría con el nombre '${formData.name}', desea continuar igualmente?`,
    });
  };

  const handleCreate = async () => {
    const category = Category.create(formData);

    saveCategory(category)
      .then(() => {
        showSnackMessage({
          message: 'Categoría creada correctamente',
          type: 'success',
        });
        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: 'Algo salió mal, intente de nuevo',
          type: 'error',
        });
        console.log('Failed to create Category!', err);
      });
  };

  return (
    <ScrollView>
      <View style={globalStyles.formContainer}>
        <View style={styles.inputGroup}>
          <Text>Tipo:</Text>
          <CategoryTypeSelector value={formData.type} onChange={(val) => onChange('type', val)} />
        </View>

        <View style={styles.inputGroup}>
          <Text>Nombre:</Text>
          <TextInput
            mode="outlined"
            value={formData.name}
            onChangeText={(val) => onChange('name', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Ícono:</Text>
          <IconSelector
            icon={formData.icon}
            onIconSelect={(icon) => onChange('icon', icon)}
            isExpense={formData.type === CategoryType.expense}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              mode="contained"
              disabled={!formData.name || !formData.icon}
              onPress={handleSubmit}
            >
              Guardar
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: 'center',
    width: screenWidth - 100,
  },
});
