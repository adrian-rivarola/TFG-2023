import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../data";
import { useGetCategories } from "../../hooks/category/useGetCategories";
import { RootStackScreenProps } from "../../types";

type ScreenProps = RootStackScreenProps<"CategoryList">;

export default function CategoryList({ navigation }: ScreenProps) {
  const { data: categories, isLoading, refetch } = useGetCategories();

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

  const onCategoryPress = (category: Category) => {
    navigation.navigate("CategoryForm", {
      id: category.id,
      icon: category.icon,
      type: category.type,
      name: category.name,
    });
  };

  const renderCategoryItem = (cat: Category) => {
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
        onPress={() => onCategoryPress(cat)}
      />
    );
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
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
          {expenseCategories.length > 0 && (
            <List.Section
              title="Egresos"
              titleStyle={{
                fontWeight: "bold",
              }}
            >
              {expenseCategories.map(renderCategoryItem)}
            </List.Section>
          )}
          {incomeCategories.length > 0 && (
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
