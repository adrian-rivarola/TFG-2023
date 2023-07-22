import { Avatar } from 'react-native-paper';

import { useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type CategoryIconProps = React.ComponentProps<typeof Avatar.Icon> & {
  isExpense?: boolean;
};

export default function CategoryIcon({ icon, size = 40, isExpense, ...props }: CategoryIconProps) {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Avatar.Icon
      {...props}
      size={size}
      style={[
        props.style,
        {
          backgroundColor: isExpense ? colors.expense : colors.income,
        },
      ]}
      icon={() => <MaterialIcons name={icon as any} size={size * 0.65} color="#FFF" />}
    />
  );
}
