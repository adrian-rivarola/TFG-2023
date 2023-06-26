import { View } from 'react-native';

import CustomChip from './CustomChip';
import { StringDateRange } from '../utils/dateUtils';

type DateRangeSelectorProps = {
  value: StringDateRange;
  onChange: (newVal: StringDateRange) => void;
};

export default function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <CustomChip onPress={() => onChange('week')} selected={value === 'week'}>
        Semana
      </CustomChip>
      <CustomChip onPress={() => onChange('month')} selected={value === 'month'}>
        Mes
      </CustomChip>
    </View>
  );
}
