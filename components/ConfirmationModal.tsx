import React from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { useTheme } from "../theme/ThemeContext";
import { useModalStore } from "../store/modalStore";

export default function ConfirmationModal() {
  const modalOptions = useModalStore((state) => state.modalOptions);
  const closeConfirmationModal = useModalStore(
    (state) => state.closeConfirmationModal
  );

  const {
    theme: { colors },
  } = useTheme();

  return (
    <Portal>
      <Dialog
        visible={!!modalOptions.visible}
        onDismiss={closeConfirmationModal}
      >
        <Dialog.Content>
          <Paragraph>
            {modalOptions.content ||
              "Está seguro que desea eliminar este elemento"}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeConfirmationModal}>
            {modalOptions.cancelText || "Cancelar"}
          </Button>
          <Button
            textColor={colors.error}
            onPress={() => {
              closeConfirmationModal();
              modalOptions.onConfirm?.();
            }}
          >
            {modalOptions.confirmText || "Confirmar"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
