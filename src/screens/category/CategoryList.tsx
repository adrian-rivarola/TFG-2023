import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';

import CustomFAB from '@/components/CustomFAB';
import CategoryIcon from '@/components/category/CategoryIcon';
import Layout from '@/constants/Layout';
import { Category, CategoryType } from '@/data';
import { useGetCategories } from '@/hooks/category';
import { useMainStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { RootStackScreenProps } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

type ScreenProps = RootStackScreenProps<'CategoryList'>;

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

  const { data: categoriesMap, isLoading } = useGetCategories();

  const [index, setIndex] = useState(initialTab || 0);
  const routes = [
    { key: 'expenses', title: 'Gastos' },
    { key: 'incomes', title: 'Ingresos' },
  ];

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

  if (isLoading || !categoriesMap) {
    return null;
  }

  const onCategoryPress = (category: Category, remove = false) => {
    switch (action) {
      case 'edit':
        navigation.navigate('CategoryForm', {
          category: category.serialize(),
        });
        break;
      case 'select':
        setSelectedCategories([category]);
        navigation.goBack();
        break;
      case 'select-multiple':
        setSelectedCategories(
          remove
            ? selectedCategories.filter((c) => c.name !== category.name)
            : [...selectedCategories, category]
        );
        break;
    }
  };

  const renderCategoryItem = (cat: Category) => {
    const checked = action !== 'edit' && selectedCategories.some((c) => c.name === cat.name);

    return (
      <List.Item
        key={cat.id}
        title={cat.name}
        style={themedStyles.categoryItem}
        left={() => <CategoryIcon size={30} icon={cat.icon} isExpense={cat.isExpense} />}
        right={() => checked && <MaterialIcons name="check" color={colors.primary} size={24} />}
        onPress={() => onCategoryPress(cat, checked)}
      />
    );
  };

  const CategoryFlatList = ({ categories }: { categories: Category[] }) => {
    return (
      <View style={styles.container}>
        {categories.length === 0 && (
          <Text style={{ alignSelf: 'center', paddingVertical: 16 }}>
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
              case 'expenses':
                return <CategoryFlatList categories={categoriesMap[CategoryType.expense]} />;
              case 'incomes':
                return <CategoryFlatList categories={categoriesMap[CategoryType.income]} />;
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
