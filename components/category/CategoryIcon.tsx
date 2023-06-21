import { Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Category } from "../../data";
import { useTheme } from "../../theme/ThemeContext";
import { View } from "react-native";

type CategoryIconProps = React.ComponentProps<typeof View> & {
  category: Category;
  size?: number;
};

export default function CategoryIcon({
  category,
  size = 40,
  ...props
}: CategoryIconProps) {
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
          backgroundColor: category.isExpense ? colors.expense : colors.income,
        },
      ]}
      icon={() => (
        <MaterialIcons
          name={category.icon as any}
          size={size / 2}
          color={colors.card}
        />
      )}
    />
  );
}
