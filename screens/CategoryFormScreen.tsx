import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import Layout from "../constants/Layout";
import { useMainContext } from "../context/MainContext";
import CategoryService, { CategoryType } from "../data/classes/Category";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "CategoryForm">;

export default function CategoryFormScreen({ navigation }: ScreenProps) {
  const { categories, setCategories } = useMainContext();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState(CategoryType.expense);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Nombre:</Text>
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={(val) => setName(val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Tipo:</Text>
          <RadioButton.Group
            onValueChange={(value) =>
              setType(
                value === "ingreso" ? CategoryType.income : CategoryType.expense
              )
            }
            value={type === CategoryType.income ? "ingreso" : "egreso"}
          >
            <RadioButton.Item label="Egreso" value="egreso" mode="android" />
            <RadioButton.Item label="Ingreso" value="ingreso" mode="android" />
          </RadioButton.Group>
        </View>

        <View style={styles.inputGroup}>
          <Text>Icon:</Text>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            value={icon}
            onChangeText={(val) => setIcon(val)}
          />
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!name || !icon}
          onPress={() => {
            const categoryService = new CategoryService();
            categoryService
              .insert({
                name,
                icon,
                type,
              })
              .then((newCategory) => {
                console.log("Category created!");
                setCategories([newCategory, ...categories]);
                navigation.goBack();
              })
              .catch((err) => {
                console.log("Failed to create Category!", err);
              });
          }}
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
    // alignSelf: "center",
    paddingVertical: 16,
    alignContent: "center",
    width: screenWidth - 100,
  },
});
