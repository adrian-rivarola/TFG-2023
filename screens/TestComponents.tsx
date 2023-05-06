import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useModalStore } from "../store/modalStore";

export default function TestComponents() {
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);
  const showConfirmationModal = useModalStore(
    (state) => state.showConfirmationModal
  );

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
