import { StyleSheet, View } from 'react-native';
import { FakeCurrencyInput } from 'react-native-currency-input';
import { Text } from 'react-native-paper';

import Layout from '@/constants/Layout';
import { useTheme } from '@/theme/ThemeContext';

type AmountInputProps = {
  label: string;
  value: number;
  setValue(val: number): void;
};
export default function AmountInput({ label, value, setValue }: AmountInputProps) {
  const { theme } = useTheme();

  const themedStyles = StyleSheet.create({
    inputContainer: {
      borderColor: theme.colors.secondary,
      width: screenWidth - 100,
      borderRadius: 4,
      borderWidth: 1,
      padding: 10,
    },
    input: {
      color: theme.colors.text,
      fontSize: 20,
    },
  });

  return (
    <View style={styles.inputGroup}>
      <Text>{label}</Text>

      <FakeCurrencyInput
        value={value}
        onChangeValue={(newVal) => {
          setValue(newVal || 0);
        }}
        prefix="Gs. "
        delimiter=","
        separator="."
        keyboardType="number-pad"
        precision={0}
        minValue={0}
        caretColor={theme.colors.primary}
        style={themedStyles.input}
        containerStyle={themedStyles.inputContainer}
      />
    </View>
  );
}
const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: 'center',
  },
});
