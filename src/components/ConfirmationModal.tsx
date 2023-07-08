import React, { useState } from 'react';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal } from 'react-native-paper';

import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';

export default function ConfirmationModal() {
  const modalOptions = useModalStore((state) => state.modalOptions);
  const closeConfirmationModal = useModalStore((state) => state.closeConfirmationModal);

  const [isLoading, setIsLoading] = useState(false);

  const {
    theme: { colors },
  } = useTheme();

  return (
    <Portal>
      <Dialog visible={!!modalOptions.visible} onDismiss={closeConfirmationModal}>
        <Dialog.Content>
          {isLoading ? (
            <ActivityIndicator style={{ paddingVertical: 30 }} />
          ) : (
            <Paragraph>
              {modalOptions.content || 'Está seguro que desea eliminar este elemento'}
            </Paragraph>
          )}
        </Dialog.Content>

        {!isLoading && (
          <Dialog.Actions>
            <Button onPress={closeConfirmationModal}>
              {modalOptions.cancelText || 'Cancelar'}
            </Button>
            <Button
              textColor={colors.error}
              onPress={() => {
                setIsLoading(true);
                modalOptions.onConfirm().finally(() => {
                  setIsLoading(false);
                  closeConfirmationModal();
                });
              }}
            >
              {modalOptions.confirmText || 'Confirmar'}
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
}
