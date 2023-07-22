import { View } from 'react-native';

import CustomChip from '../CustomChip';
import { CategoryType } from '@/data';

type CategorySelectorProps = {
  value: CategoryType;
  onChange: (newVal: CategoryType) => void;
};

export default function CategoryTypeSelector({ value, onChange }: CategorySelectorProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <CustomChip
        onPress={() => onChange(CategoryType.expense)}
        selected={value === CategoryType.expense}
      >
        Gastos
      </CustomChip>
      <CustomChip
        onPress={() => onChange(CategoryType.income)}
        selected={value === CategoryType.income}
      >
        Ingresos
      </CustomChip>
    </View>
  );
}
