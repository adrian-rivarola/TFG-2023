import React, { useImperativeHandle, useState } from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

type ModalOptions = {
  content: string;
  confirmText: string;
  cancelText: string;
  onConfirm?(): void;
};

export type ModalRef = {
  showConfirmationModal(opts: Partial<ModalOptions>): void;
};

const ConfirmationModal: React.ForwardRefRenderFunction<ModalRef, {}> = (
  props,
  ref
) => {
  useImperativeHandle(ref, () => ({
    showConfirmationModal,
  }));

  const initialModalOptions: ModalOptions = {
    content: "Está seguro que desea eliminar este elemento?",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
  };

  const [visible, setVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState(initialModalOptions);
  const {
    theme: { colors },
  } = useTheme();

  const hideDialog = () => setVisible(false);
  const showConfirmationModal = (modalOptions: Partial<ModalOptions>) => {
    setModalOptions({
      ...initialModalOptions,
      ...modalOptions,
    });
    setVisible(true);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>{modalOptions.content}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
            }}
          >
            {modalOptions.cancelText}
          </Button>
          <Button
            textColor={colors.error}
            onPress={() => {
              hideDialog();
              modalOptions.onConfirm?.();
            }}
          >
            {modalOptions.confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default React.forwardRef(ConfirmationModal);
