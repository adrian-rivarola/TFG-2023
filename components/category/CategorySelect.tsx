import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";

import { useTheme } from "../../theme/ThemeContext";
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
      padding: 0,
      marginTop: 5,
    },
    categoryItem: {
      paddingStart: 10,
      paddingEnd: 5,
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderColor: colors.secondary,
      borderRadius: 4,
      borderWidth: 1,
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
              multiple ? (
                <MaterialIcons
                  size={20}
                  name="close"
                  color={colors.primary}
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <MaterialIcons
                  size={30}
                  name="swap-horiz"
                  color={colors.primary}
                  style={{ alignSelf: "center" }}
                />
              )
            }
            onPress={() => {
              if (multiple) {
                setSelectedCategories(
                  selectedCategories.filter((cat) => cat.id !== category.id)
                );
              } else {
                navigation.navigate("CategoryList", {
                  action: multiple ? "select-multiple" : "select",
                  initialTab: selectedCategories[0]?.type,
                  categoryType: expenseOnly ? CategoryType.expense : undefined,
                });
              }
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
