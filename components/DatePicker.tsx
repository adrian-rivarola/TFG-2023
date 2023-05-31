import dayjs from "dayjs";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
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
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text
          style={{
            borderColor: theme.colors.secondary,
            borderWidth: 1,
            borderRadius: 4,
            padding: 14,
            textTransform: "capitalize",
          }}
        >
          {dayjs(date).format("dddd, DD [de] MMMM")}
        </Text>
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        validRange={{
          startDate: minDate,
          endDate: maxDate,
        }}
        onDismiss={() => setOpen(false)}
        onConfirm={({ date }) => {
          if (date) {
            onChange(date);
            setOpen(false);
          }
        }}
        dateMode="start"
      />
    </>
  );
}
