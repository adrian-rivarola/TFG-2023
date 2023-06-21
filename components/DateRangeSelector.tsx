import { View } from "react-native";
import { StringDateRange } from "../utils/dateUtils";
import CustomChip from "./CustomChip";

type DateRangeSelectorProps = {
  value: StringDateRange;
  onChange: (newVal: StringDateRange) => void;
};

export default function DateRangeSelector({
  value,
  onChange,
}: DateRangeSelectorProps) {
  return (
    <View style={{ flexDirection: "row" }}>
      <CustomChip onPress={() => onChange("week")} selected={value === "week"}>
        Semana
      </CustomChip>
      <CustomChip
        onPress={() => onChange("month")}
        selected={value === "month"}
      >
        Mes
      </CustomChip>
    </View>
  );
}
