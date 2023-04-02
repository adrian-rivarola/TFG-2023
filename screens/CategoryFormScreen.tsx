import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";

import Layout from "../constants/Layout";
import { useMainContext } from "../context/MainContext";
import { useRefContext } from "../context/RefContext";
import { Category, CategoryType, dataSource } from "../data";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "CategoryForm">;

export default function CategoryFormScreen({ navigation }: ScreenProps) {
  const { categories, setCategories } = useMainContext();
  const { snackRef } = useRefContext();
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
          <View>
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              value={icon}
              onChangeText={(val) => setIcon(val)}
            />
          </View>
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!name || !icon}
          onPress={() => {
            const category = new Category();
            category.name = name;
            category.icon = icon;
            category.type = type;

            dataSource
              .getRepository(Category)
              .save(category)
              .then((newCategory) => {
                setCategories([newCategory, ...categories]);
                snackRef.current?.showSnackMessage({
                  message: "Categoría creada correctamente",
                  type: "success",
                });
                navigation.goBack();
              })
              .catch((err) => {
                snackRef.current?.showSnackMessage({
                  message: "Algo salió mal, intente de nuevo",
                  type: "error",
                });
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
