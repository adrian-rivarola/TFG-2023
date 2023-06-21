import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useTheme } from "../../context/ThemeContext";
import { CategoryType } from "../../data";
import { useMainStore } from "../../store";
import CategoryIcon from "./CategoryIcon";

type CategorySelectProps = React.ComponentProps<typeof View> & {
  label: string;
  multiple?: boolean;
  expenseOnly?: boolean;
};

export default function CategorySelect({
  expenseOnly,
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

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 0,
      marginTop: 5,
    },
    categoryItem: {
      backgroundColor: colors.surface,
      paddingStart: 10,
      paddingEnd: 5,
      justifyContent: "center",
    },
  });

  return (
    <View {...props}>
      <Text>{label}</Text>

      {selectedCategories.map((category) => (
        <View key={category.id} style={styles.container}>
          <List.Item
            title={category.name}
            style={styles.categoryItem}
            left={() => <CategoryIcon category={category} size={30} />}
            right={() =>
              !multiple && (
                <MaterialIcons
                  name="swap-horiz"
                  color={colors.primary}
                  size={30}
                />
              )
            }
            onPress={() => {
              navigation.navigate("CategoryList", {
                action: multiple ? "select-multiple" : "select",
                initialTab: selectedCategories[0]?.type,
                categoryType: expenseOnly ? CategoryType.expense : undefined,
              });
            }}
          />
        </View>
      ))}

      {(selectedCategories.length === 0 || multiple) && (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Button
            icon="plus"
            mode="text"
            onPress={() => {
              navigation.navigate("CategoryList", {
                action: multiple ? "select-multiple" : "select",
                initialTab: selectedCategories[0]?.type,
                categoryType: expenseOnly ? CategoryType.expense : undefined,
              });
            }}
          >
            {multiple ? "Agregar categoría" : "Seleccionar categoría"}
          </Button>
        </View>
      )}
    </View>
  );
}
