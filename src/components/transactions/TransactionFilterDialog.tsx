import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Dialog, IconButton, Portal, Text } from 'react-native-paper';

import CustomChip from '../CustomChip';
import { CategoryType } from '@/data';
import { useGetCategories } from '@/hooks/category/useGetCategories';
import { TransactionFilter, useMainStore } from '@/store';
import { ThemeContextProvider, useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionFilterDialog() {
  const {
    theme: { colors },
  } = useTheme();
  const [activeFilters, setActiveFilters] = useMainStore((store) => [
    store.activeFilters,
    store.setActiveFilters,
  ]);
  const [filters, setFilters] = useState<TransactionFilter>(activeFilters);
  const [visible, setVisible] = useState(false);

  const { data: categoriesMap } = useGetCategories();

  const shownCategories =
    !categoriesMap || filters.categoryType === undefined
      ? Object.values(categoriesMap || {}).flat()
      : categoriesMap[filters.categoryType] || [];

  const closeDialog = (updated?: boolean) => {
    setVisible(false);
    if (!updated) {
      setTimeout(() => setFilters(activeFilters), 10);
    }
  };

  useEffect(() => {
    setFilters({
      ...filters,
      categories: [],
    });
  }, [filters.categoryType]);

  if (!categoriesMap) {
    return null;
  }

  return (
    <>
      <IconButton
        icon={() => <MaterialIcons name="filter-alt" color={colors.text} size={25} />}
        onPress={() => {
          setVisible(true);
        }}
      />

      <Portal>
        <ThemeContextProvider>
          <Dialog
            style={{
              backgroundColor: colors.background,
            }}
            visible={visible}
            onDismiss={closeDialog}
          >
            <Dialog.Title
              style={{
                fontSize: 18,
              }}
            >
              Filtrar transacciones
            </Dialog.Title>

            <Dialog.ScrollArea>
              <ScrollView
                contentContainerStyle={{
                  marginVertical: 15,
                }}
              >
                <View>
                  <Text variant="labelLarge">Tipo:</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <CustomChip
                      selected={filters.categoryType === undefined}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          categoryType: undefined,
                        })
                      }
                    >
                      Todos
                    </CustomChip>
                    <CustomChip
                      selected={filters.categoryType === CategoryType.expense}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          categoryType: CategoryType.expense,
                        })
                      }
                    >
                      Gastos
                    </CustomChip>
                    <CustomChip
                      selected={filters.categoryType === CategoryType.income}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          categoryType: CategoryType.income,
                        })
                      }
                    >
                      Ingresos
                    </CustomChip>
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 20,
                  }}
                />

                {shownCategories.length > 0 && (
                  <View>
                    <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                      Categorías:
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}
                    >
                      {shownCategories.map((cat) => (
                        <CustomChip
                          key={cat.id}
                          icon={cat.icon}
                          onPress={() => {
                            const selectedCategories = filters.categories || [];
                            const newCategories = selectedCategories.includes(cat.id)
                              ? selectedCategories.filter((c) => c !== cat.id)
                              : selectedCategories.concat(cat.id);

                            setFilters({
                              ...filters,
                              categories: newCategories,
                            });
                          }}
                          selected={filters.categories?.includes(cat.id)}
                          style={{
                            marginEnd: 5,
                            marginBottom: 5,
                            padding: 0,
                          }}
                        >
                          {cat.name}
                        </CustomChip>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>
            </Dialog.ScrollArea>

            <Dialog.Actions>
              <Button onPress={() => closeDialog()}>Cancelar</Button>
              <Button
                onPress={() => {
                  setActiveFilters(filters);
                  closeDialog(true);
                }}
              >
                Confirmar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </ThemeContextProvider>
      </Portal>
    </>
  );
}
