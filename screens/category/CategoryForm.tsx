import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import CategoryTypeSelector from '../../components/CategoryTypeSelector';
import Layout from '../../constants/Layout';
import { Category, CategoryFormData, CategoryType } from '../../data';
import { useDeleteCategory } from '../../hooks/category/useDeleteCategory';
import { useSaveCategory } from '../../hooks/category/useSaveCategory';
import useForm from '../../hooks/useForm';
import { useModalStore } from '../../store/modalStore';
import { useTheme } from '../../theme/ThemeContext';
import { globalStyles } from '../../theme/globalStyles';
import { RootStackScreenProps } from '../../types';

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
  const { mutateAsync: saveCategory } = useSaveCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);

  const [formData, onChange] = useForm({
    ...DEFAULT_CATEGORY,
    ...route.params?.category,
  });

  const handleSubmit = () => {
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

  const handleDelete = () => {
    // TODO: Show confirm validation
    deleteCategory(formData.id!).then(() => {
      navigation.goBack();
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

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!formData.name || !formData.icon}
          onPress={handleSubmit}>
          Guardar
        </Button>

        {formData.id && (
          <Button mode="contained" style={{ marginTop: 24 }} onPress={handleDelete}>
            Eliminar
          </Button>
        )}
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
