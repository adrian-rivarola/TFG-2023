import React from 'react';
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import CustomChip from '../CustomChip';
import { CategoryType } from '@/data';
import { useMainStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type CategorySelectProps = React.ComponentProps<typeof View> & {
  label: string;
  multiple?: boolean;
  categoryType?: CategoryType;
};

export default function CategorySelect({
  categoryType,
  multiple,
  label,
  ...props
}: CategorySelectProps) {
  const navigation = useNavigation();

  const {
    theme: { colors },
  } = useTheme();
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);

  return (
    <View {...props}>
      <Text>{label}</Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {selectedCategories.map((cat) => (
          <CustomChip
            selected
            key={cat.id}
            icon={cat.icon}
            onPress={() => {
              if (multiple) {
                setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id));
              } else {
                navigation.navigate('CategoryList', {
                  categoryType,
                  initialTab: selectedCategories[0]?.type,
                  action: multiple ? 'select-multiple' : 'select',
                });
              }
            }}
            style={{ marginBottom: 10 }}
          >
            {cat.name}
          </CustomChip>
        ))}

        {(selectedCategories.length === 0 || multiple) && (
          <Chip
            onPress={() => {
              navigation.navigate('CategoryList', {
                categoryType,
                initialTab: selectedCategories[0]?.type,
                action: multiple ? 'select-multiple' : 'select',
              });
            }}
            style={{
              marginEnd: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.primaryContainer,
              backgroundColor: colors.surface,
            }}
            icon={() => <MaterialIcons name="add-circle" size={16} color={colors.primary} />}
          >
            Agregar categoría
          </Chip>
        )}
      </View>
    </View>
  );
}
