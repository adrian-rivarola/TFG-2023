import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, TouchableWithoutFeedback } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

type DatePickerProps = {
  date: Date;
  minDate?: Date;
  maxDate?: Date;

  onChange: React.Dispatch<React.SetStateAction<Date>>;
};
export function DatePicker({
  date,
  minDate,
  maxDate,
  onChange,
}: DatePickerProps) {
  const { themeType, theme } = useTheme();

  return Platform.OS === "ios" ? (
    <RNDateTimePicker
      themeVariant={themeType}
      value={date}
      minimumDate={minDate}
      maximumDate={maxDate}
      onChange={(e, newDate) => newDate && onChange(newDate)}
      style={{
        alignSelf: "flex-start",
      }}
    />
  ) : (
    <TouchableWithoutFeedback
      onPress={() => {
        DateTimePickerAndroid.open({
          minimumDate: minDate,
          maximumDate: maxDate,
          value: date,
          onChange: (e, newDate) => {
            newDate && onChange(newDate);
          },
        });
      }}
    >
      <Text
        style={{
          borderColor: theme.colors.secondary,
          borderWidth: 1,
          borderRadius: 4,
          padding: 14,
        }}
      >
        {date.toDateString()}
      </Text>
    </TouchableWithoutFeedback>
  );
}
