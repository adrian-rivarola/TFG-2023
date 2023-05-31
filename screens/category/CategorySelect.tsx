import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Checkbox, List, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Category, CategoryType } from "../../data";
import { useGetCategories } from "../../hooks/category/useGetCategories";
import { useCategoryStore } from "../../store";
import { RootStackScreenProps } from "../../types";

type ScreenProps = RootStackScreenProps<"CategorySelect">;

export default function CategorySelect({ navigation, route }: ScreenProps) {
  const { data: categories, isLoading } = useGetCategories();
  const [selectedCategories, setSelectedCategories] = useCategoryStore(
    (state) => [state.selectedCategories, state.setSelectedCategories]
  );

  const { multiple = false, categoryType } = route.params || {};
  const expenseCategories = useMemo(
    () => categories?.filter((c) => c.isExpense) ?? [],
    [categories]
  );
  const incomeCategories = useMemo(
    () => categories?.filter((c) => c.isIncome) ?? [],
    [categories]
  );

  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = {
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
  };

  if (isLoading || !categories) {
    return null;
  }

  const onCategoryPress = (category: Category, remove: boolean) => {
    if (!multiple) {
      setSelectedCategories([category]);
      navigation.goBack();
    } else if (remove) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderCategoryItem = (cat: Category) => {
    const checked = multiple && selectedCategories.some((c) => c.id === cat.id);

    return (
      <List.Item
        key={cat.id}
        title={cat.name}
        style={themedStyles.categoryItem}
        left={() => (
          <MaterialIcons
            name={cat.icon.toLowerCase() as any}
            color={colors.text}
            size={24}
            style={{ marginStart: 16 }}
          />
        )}
        right={() =>
          multiple && <Checkbox status={checked ? "checked" : "unchecked"} />
        }
        onPress={() => onCategoryPress(cat, checked)}
      />
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
          }}
        >
          {incomeCategories.length === 0 && expenseCategories.length === 0 && (
            <Text style={{ alignSelf: "center", paddingVertical: 16 }}>
              Aún no tienes ninguna categoría
            </Text>
          )}
          {/* TODO: Improve this filter */}
          {[undefined, CategoryType.expense].includes(categoryType) &&
            expenseCategories.length > 0 && (
              <List.Section
                title="Egresos"
                titleStyle={{
                  fontWeight: "bold",
                }}
              >
                {expenseCategories.map(renderCategoryItem)}
              </List.Section>
            )}
          {[undefined, CategoryType.income].includes(categoryType) &&
            incomeCategories.length > 0 && (
              <List.Section
                title="Ingresos"
                titleStyle={{
                  fontWeight: "bold",
                }}
              >
                {incomeCategories.map(renderCategoryItem)}
              </List.Section>
            )}
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 16 }}
          icon="plus"
          onPress={() => {
            navigation.navigate("CategoryForm");
          }}
        >
          Agregar nueva categoría
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
