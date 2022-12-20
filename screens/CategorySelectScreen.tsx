import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, List } from "react-native-paper";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import CategoryService, {
  Category,
  CategoryType,
} from "../data/classes/Category";

const categoryService = new CategoryService();

import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "CategorySelect">;

export default function CategorySelectScreen({ navigation }: ScreenProps) {
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const {
    theme: { colors },
  } = useTheme();
  const { setCategories } = useMainContext();

  const themedStyles = {
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.onSecondary,
    },
  };

  useEffect(() => {
    categoryService
      .query({})
      .then((res) => {
        setCategories(res);
        setExpenseCategories(
          res.filter((cat) => cat.type === CategoryType.expense)
        );
        setIncomeCategories(
          res.filter((cat) => cat.type === CategoryType.income)
        );

        // console.log(`Found ${res.length} categories`);
      })
      .catch((err) => {
        console.log("Failed to get categories", err);
      });
  }, []);

  const onCategoryPress = (category: Category) => {
    navigation.navigate("TransactionCreate", {
      selectedCategoryId: category.id,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {expenseCategories.length > 0 && (
          <List.Section
            title="Egresos"
            titleStyle={{
              fontWeight: "bold",
            }}
          >
            {expenseCategories.map((cat) => (
              <List.Item
                key={cat.id}
                title={cat.name}
                style={themedStyles.categoryItem}
                onPress={() => onCategoryPress(cat)}
              />
            ))}
          </List.Section>
        )}
        {incomeCategories.length > 0 && (
          <List.Section
            title="Ingresos"
            titleStyle={{
              fontWeight: "bold",
            }}
          >
            {incomeCategories.map((cat) => (
              <List.Item
                key={cat.id}
                title={cat.name}
                style={themedStyles.categoryItem}
                onPress={() => onCategoryPress(cat)}
              />
            ))}
          </List.Section>
        )}
        <Button
          mode="contained-tonal"
          style={{ marginTop: 16 }}
          icon="plus"
          onPress={() => {
            navigation.navigate("CategoryCreate");
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
  },
});
