import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import { RootTabParamList } from "../types";
import { Category, CategoryType } from "../data";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "CategorySelect">;

export default function CategorySelectScreen({ navigation }: ScreenProps) {
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const {
    theme: { colors },
  } = useTheme();
  const { categories, selectCategory } = useMainContext();

  const themedStyles = {
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
  };

  useEffect(() => {
    setExpenseCategories(
      categories.filter((cat) => cat.type === CategoryType.expense)
    );
    setIncomeCategories(
      categories.filter((cat) => cat.type === CategoryType.income)
    );
  }, [categories]);

  const onCategoryPress = (category: Category) => {
    selectCategory(category);
    navigation.goBack();
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
          mode="contained-tonal"
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
