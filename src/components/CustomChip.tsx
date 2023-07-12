import { Chip } from 'react-native-paper';

import { useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type CustomChipProps = React.ComponentProps<typeof Chip>;

export default function CustomChip({
  children,
  selected,
  style,
  icon,
  onPress,
  ...props
}: CustomChipProps) {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Chip
      icon={() =>
        icon && <MaterialIcons name={icon as any} size={16} color={colors.onPrimaryContainer} />
      }
      onPress={onPress}
      style={{
        marginEnd: 10,
        borderColor: colors.primaryContainer,
        borderWidth: 2,
        backgroundColor: selected ? colors.primaryContainer : colors.surface,
        ...style,
      }}
      textStyle={{
        fontSize: 12,
      }}
      {...props}
    >
      {children}
    </Chip>
  );
}
