import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";

import Layout from "../../constants/Layout";
import { Category, CategoryType } from "../../data";
import { useSaveCategory } from "../../hooks/category/useSaveCategory";
import { useModalStore } from "../../store/modalStore";
import { RootTabParamList } from "../../types";

type ScreenProps = NativeStackScreenProps<RootTabParamList, "CategoryForm">;

export default function CategoryForm({ navigation }: ScreenProps) {
  const { mutateAsync: saveCategory } = useSaveCategory();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState(CategoryType.expense);

  const onSubmit = () => {
    const category = Category.create({
      name,
      icon,
      type,
    });

    saveCategory(category)
      .then(() => {
        showSnackMessage({
          message: "Categoría creada correctamente",
          type: "success",
        });

        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: "Algo salió mal, intente de nuevo",
          type: "error",
        });
        console.log("Failed to create Category!", err);
      });
  };

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
          {icon.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <MaterialIcons name={icon as any} size={24} color="black" />
            </View>
          )}
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!name || !icon}
          onPress={onSubmit}
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
