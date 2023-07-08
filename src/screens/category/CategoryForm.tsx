import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';

import CategoryTypeSelector from '@/components/category/CategoryTypeSelector';
import DeleteCategoryButton from '@/components/category/DeleteCategoryButton';
import Layout from '@/constants/Layout';
import { Category, CategoryFormData, CategoryType } from '@/data';
import { useSaveCategory } from '@/hooks/category';
import useForm from '@/hooks/useForm';
import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { globalStyles } from '@/theme/globalStyles';
import { RootStackScreenProps } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

const materialIcons = MaterialIcons.getRawGlyphMap();

type ScreenProps = RootStackScreenProps<'CategoryForm'>;

const DEFAULT_CATEGORY: CategoryFormData = {
  name: '',
  icon: '',
  type: CategoryType.expense,
};

export default function CategoryForm({ navigation, route }: ScreenProps) {
  const {
    theme: { colors },
  } = useTheme();
  const { mutateAsync: saveCategory, isLoading } = useSaveCategory();
  const [showSnackMessage, showConfirmationModal] = useModalStore((state) => [
    state.showSnackMessage,
    state.showConfirmationModal,
  ]);

  const [formData, onChange] = useForm({
    ...DEFAULT_CATEGORY,
    ...route.params?.category,
  });

  useEffect(() => {
    if (formData.id) {
      navigation.setOptions({
        headerRight: () => <DeleteCategoryButton categoryId={formData.id!} />,
      });
    }
  }, []);

  const handleSubmit = async () => {
    const category = await Category.findOne({
      where: {
        name: formData.name,
      },
      withDeleted: true,
    });

    if (category === null) {
      return handleCreate();
    }

    showConfirmationModal({
      onConfirm: handleCreate,
      content: `Ya existe una categoría con el nombre '${formData.name}', desea continuar igualmente?`,
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

        {/* TODO: Add an icon/emoji selector */}
        <View style={styles.inputGroup}>
          <Text>Ícono:</Text>
          <View>
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              value={formData.icon}
              onChangeText={(val) => onChange('icon', val)}
            />
          </View>

          {formData.icon && (materialIcons as any)[formData.icon as any] && (
            <View style={{ marginTop: 8 }}>
              <MaterialIcons name={formData.icon as any} size={24} color={colors.text} />
            </View>
          )}
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
