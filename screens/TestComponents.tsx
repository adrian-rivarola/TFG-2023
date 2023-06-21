import { StyleSheet, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { useModalStore } from "../store/modalStore";
import { DEFAULT_CATEGORIES } from "../data/default-values";
import CategoryList from "./category/CategoryList";

export default function TestComponents() {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const showConfirmationModal = useModalStore(
    (state) => state.showConfirmationModal
  );
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={{
          marginBottom: 16,
        }}
        onPress={() => {
          showConfirmationModal({
            content: "Hola",
            onConfirm: () => {
              showSnackMessage({
                message: "Modal confirmado!",
                type: "success",
              });
            },
          });
        }}
      >
        Confirmation modal
      </Button>
      <Button
        mode="contained"
        style={{
          marginBottom: 16,
        }}
        onPress={() => {
          showSnackMessage({
            message: "Success snack message!",
            type: "success",
          });
        }}
      >
        Success snackbar
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          showSnackMessage({
            message: "Error snack message!",
            type: "error",
          });
        }}
      >
        Error snackbar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});
