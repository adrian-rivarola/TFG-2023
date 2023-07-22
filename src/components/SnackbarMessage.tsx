import { Snackbar } from 'react-native-paper';

import { useModalStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';

export default function SnackbarMessage() {
  const snackOptions = useModalStore((state) => state.snackOptions);
  const hideSnackMessage = useModalStore((state) => state.hideSnackMessage);

  const {
    theme: { colors },
  } = useTheme();

  return (
    <Snackbar
      style={{
        backgroundColor: snackOptions.type === 'error' ? colors.error : colors.onSurface,
      }}
      visible={!!snackOptions.visible}
      onDismiss={hideSnackMessage}
      theme={{ colors: { inversePrimary: colors.onPrimary } }}
      duration={4000}
      action={{
        label: 'OK',
        onPress: hideSnackMessage,
      }}
    >
      {snackOptions.message}
    </Snackbar>
  );
}
