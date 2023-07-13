import { useState } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator, Button, Dialog, IconButton, Portal } from 'react-native-paper';

import AmountInput from './forms/AmountInput';
import { Balance } from '@/data';
import { useUpdateBalance } from '@/hooks/balance';
import { useModalStore } from '@/store';
import { ThemeContextProvider, useTheme } from '@/theme/ThemeContext';

type AdjustBalanceDialogProps = {
  balance: number;
};

export default function AdjustBalanceDialog({ balance }: AdjustBalanceDialogProps) {
  const {
    theme: { colors },
  } = useTheme();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);

  const [visible, setVisible] = useState(false);
  const [newBalance, setNewBalance] = useState(balance);
  const { mutateAsync: updateBalance, isLoading } = useUpdateBalance();

  const closeDialog = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    const [res] = await Balance.find({ take: 1 });
    const { initialBalance = 0 } = res || {};
    const newInitialBalance = newBalance + initialBalance - balance;

    updateBalance(newInitialBalance)
      .then(() => {
        closeDialog();
        showSnackMessage({
          type: 'success',
          message: 'Se ha actualizado el balance actual!',
        });
      })
      .catch((err) => {
        console.log('Failed to update balance', err);
      });
  };

  return (
    <>
      <IconButton
        icon="cog"
        iconColor={colors.secondary}
        size={25}
        onPress={() => {
          setVisible(true);
        }}
      />

      <Portal>
        <Dialog
          style={{
            backgroundColor: colors.background,
          }}
          visible={visible}
          dismissable={false}
          onDismiss={closeDialog}
        >
          <Dialog.Title
            style={{
              fontSize: 18,
            }}
          >
            Ajustar balance
          </Dialog.Title>

          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{}}>
              <ThemeContextProvider>
                <AmountInput value={newBalance} setValue={setNewBalance} />
              </ThemeContextProvider>
            </ScrollView>
          </Dialog.ScrollArea>

          {isLoading ? (
            <Dialog.Actions style={{ justifyContent: 'center' }}>
              <ActivityIndicator />
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button onPress={closeDialog}>Cancelar</Button>
              <Button onPress={() => handleSubmit()}>Confirmar</Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    </>
  );
}
