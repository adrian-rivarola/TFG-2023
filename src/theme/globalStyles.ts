import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from '@/constants/Layout';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    margin: 10,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputGroup: {
    flex: 1,
    paddingVertical: 15,
    alignContent: 'center',
    width: SCREEN_WIDTH - 100,
  },
});
