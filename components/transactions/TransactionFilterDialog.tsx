import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, Dialog, IconButton, Portal, Text } from 'react-native-paper';

import { CategoryType } from '../../data';
import { useGetCategories } from '../../hooks/category/useGetCategories';
import { useMainStore } from '../../store';
import { useTheme } from '../../theme/ThemeContext';

export default function TransactionFilterDialog() {
  const {
    theme: { colors },
  } = useTheme();
  const [activeFilters, setActiveFilters] = useMainStore((store) => [
    store.activeFilters,
    store.setActiveFilters,
  ]);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const { data: categories } = useGetCategories();

  const closeDialog = () => {
    setVisible(false);
  };

  if (!categories) {
    return null;
  }

  return (
    <>
      <IconButton
        icon={() => <MaterialIcons name="filter-list" size={25} />}
        onPress={() => {
          setVisible(true);
        }}
      />

      <Portal>
        <Dialog
          style={{
            backgroundColor: colors.background,
          }}
          visible={isFocused && visible}
          onDismiss={closeDialog}>
          <Dialog.Title
            style={{
              fontSize: 18,
            }}>
            Filtrar transacciones
          </Dialog.Title>

          <Dialog.ScrollArea>
            <ScrollView
              contentContainerStyle={{
                marginVertical: 15,
              }}>
              <View>
                <Text variant="labelLarge">Tipo:</Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Chip
                    selected={activeFilters.type === CategoryType.income}
                    onPress={() =>
                      setActiveFilters({
                        ...activeFilters,
                        type: CategoryType.income,
                      })
                    }
                    style={{ marginEnd: 10 }}>
                    Ingresos
                  </Chip>
                  <Chip
                    selected={activeFilters.type === CategoryType.expense}
                    onPress={() =>
                      setActiveFilters({
                        ...activeFilters,
                        type: CategoryType.expense,
                      })
                    }>
                    Egresos
                  </Chip>
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                }}
              />

              <View>
                <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                  Categorías:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {categories?.map((cat) => (
                    <Chip
                      key={cat.id}
                      onPress={() => {}}
                      style={{
                        marginEnd: 10,
                        marginBottom: 10,
                      }}
                      icon={() => <MaterialIcons name={cat.icon as any} />}>
                      {cat.name}
                    </Chip>
                  ))}
                </View>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancelar</Button>
            <Button onPress={closeDialog}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
