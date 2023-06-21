import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";

import CustomFAB from "../../components/CustomFAB";
import Layout from "../../constants/Layout";
import { useTheme } from "../../context/ThemeContext";
import { Category, CategoryType } from "../../data";
import { getDefaultCategories } from "../../data/mock";
import { useGetCategories } from "../../hooks/category/useGetCategories";
import { useMainStore } from "../../store";
import { RootStackScreenProps } from "../../types";
import CategoryIcon from "../../components/category/CategoryIcon";

type ScreenProps = RootStackScreenProps<"CategoryList">;

const screenWidth = Layout.window.width;

export default function CategoryList({ navigation, route }: ScreenProps) {
  const {
    theme: { colors },
  } = useTheme();
  const { action, categoryType, initialTab } = route.params;
  const [selectedCategories, setSelectedCategories] = useMainStore((state) => [
    state.selectedCategories,
    state.setSelectedCategories,
  ]);

  const { data: categories, isLoading } = useGetCategories();
  // const categories = getDefaultCategories();

  const [index, setIndex] = useState(initialTab || 0);
  const routes = [
    { key: "expenses", title: "Gastos" },
    { key: "incomes", title: "Ingresos" },
  ];

  const categoriesMap: Record<CategoryType, Category[]> = useMemo(
    () => ({
      [CategoryType.expense]: categories?.filter((c) => c.isExpense) ?? [],
      [CategoryType.income]: categories?.filter((c) => c.isIncome) ?? [],
    }),
    [categories]
  );

  useEffect(() => {
    if (categoryType !== undefined) {
      const categoryTitle =
        categoryType === CategoryType.expense ? "Gastos" : "Ingresos";
      navigation.setOptions({
        title: `Categorías - ${categoryTitle}`,
      });
    }
  }, [categoryType]);

  const themedStyles = {
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 15,
    },
    list: {
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
  };

  if (isLoading || !categories) {
    return null;
  }

  const onCategoryPress = (category: Category, remove = false) => {
    switch (action) {
      case "edit":
        navigation.navigate("CategoryForm", {
          id: category.id,
          icon: category.icon,
          type: category.type,
          name: category.name,
        });
        break;
      case "select":
        setSelectedCategories([category]);
        navigation.goBack();
        break;
      case "select-multiple":
        setSelectedCategories(
          remove
            ? selectedCategories.filter((c) => c.name !== category.name)
            : [...selectedCategories, category]
        );
        break;
    }
  };

  const renderCategoryItem = (cat: Category) => {
    const checked =
      action !== "edit" && selectedCategories.some((c) => c.name === cat.name);

    return (
      <List.Item
        key={cat.id}
        title={cat.name}
        style={themedStyles.categoryItem}
        left={() => <CategoryIcon size={30} category={cat} />}
        right={() =>
          checked && (
            <MaterialIcons name="check" color={colors.primary} size={24} />
          )
        }
        onPress={() => onCategoryPress(cat, checked)}
      />
    );
  };

  const CategoryFlatList = ({ categories }: { categories: Category[] }) => {
    return (
      <View style={styles.container}>
        {categories.length === 0 && (
          <Text style={{ alignSelf: "center", paddingVertical: 16 }}>
            Aún no tienes ninguna categoría
          </Text>
        )}

        <FlatList
          style={themedStyles.list}
          data={categories}
          renderItem={({ item }) => renderCategoryItem(item)}
        />
      </View>
    );
  };

  return (
    <>
      {categoryType !== undefined ? (
        <CategoryFlatList categories={categoriesMap[categoryType]} />
      ) : (
        <TabView
          initialLayout={{
            width: screenWidth,
          }}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={({ route }) => {
            switch (route.key) {
              case "expenses":
                return (
                  <CategoryFlatList
                    categories={categoriesMap[CategoryType.expense]}
                  />
                );
              case "incomes":
                return (
                  <CategoryFlatList
                    categories={categoriesMap[CategoryType.income]}
                  />
                );
            }
          }}
          renderTabBar={(props) => (
            <TabBar
              indicatorStyle={{ backgroundColor: colors.primary }}
              style={{ backgroundColor: colors.background }}
              labelStyle={{ color: colors.text }}
              {...props}
            />
          )}
        />
      )}

      <View style={{ marginBottom: 80 }}>
        <CustomFAB destination="CategoryForm" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
