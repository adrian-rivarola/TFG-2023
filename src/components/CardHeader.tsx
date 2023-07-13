import React, { ComponentProps, ReactNode } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { useTheme } from '@/theme/ThemeContext';

type CardHeaderProps = {
  title: string;
  style?: ViewStyle;
  children: ReactNode;
  titleVariant?: ComponentProps<typeof Text>['variant'];
  onSeeMorePress?: () => void;
};

export default function CardHeader({
  title,
  style,
  children,
  onSeeMorePress,
  titleVariant = 'titleMedium',
}: CardHeaderProps) {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <Text variant={titleVariant}>{title}</Text>

        {onSeeMorePress !== undefined && (
          <TouchableOpacity onPress={onSeeMorePress}>
            <Text style={{ color: colors.primary }} variant="titleSmall">
              Ver más
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}
