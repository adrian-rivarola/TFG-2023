import { StyleSheet, View } from "react-native";
import Layout from "../constants/Layout";
import { MaskedTextInput } from "react-native-mask-text";
import { useTheme } from "../context/ThemeContext";
import { Text } from "react-native-paper";

type AmountInputProps = {
  label: string;
  value: number;
  setValue(val: number): void;
};
export default function AmountInput({
  label,
  value,
  setValue,
}: AmountInputProps) {
  const { theme } = useTheme();

  const themedStyles = StyleSheet.create({
    amountInput: {
      width: screenWidth - 100,
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      borderRadius: 4,
      padding: 14,
    },
  });

  return (
    <View style={styles.inputGroup}>
      <Text>{label}</Text>

      <MaskedTextInput
        style={themedStyles.amountInput}
        keyboardType="numeric"
        type="currency"
        options={{
          prefix: "Gs. ",
          decimalSeparator: ",",
          groupSeparator: ".",
        }}
        value={String(value)}
        onChangeText={(text, rawText) => {
          setValue(isNaN(parseInt(rawText)) ? 0 : parseInt(rawText));
        }}
      />
    </View>
  );
}
const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    paddingVertical: 16,
    alignContent: "center",
  },
});
