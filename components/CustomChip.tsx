import { Chip } from 'react-native-paper';

import { useTheme } from '../theme/ThemeContext';

type CustomChipProps = {
  selected: boolean;
  onPress: () => void;
  children: string;
};

export default function CustomChip({ selected, onPress, children }: CustomChipProps) {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Chip
      onPress={onPress}
      style={{
        marginEnd: 10,
        borderColor: colors.primaryContainer,
        borderWidth: 2,
        backgroundColor: selected ? colors.primaryContainer : colors.surface,
      }}>
      {children}
    </Chip>
  );
}
