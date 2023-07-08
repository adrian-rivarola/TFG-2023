import React from 'react';
import { ViewStyle } from 'react-native';
import { Card, Text } from 'react-native-paper';

type EmptyCardProps = {
  text?: string;
  style?: ViewStyle;
};

export default function EmptyCard({ text, style }: EmptyCardProps) {
  return (
    <Card elevation={1} style={style}>
      <Card.Content>
        <Text style={{ alignSelf: 'center' }} variant="titleSmall">
          {text || 'Aún no hay registros en este periodo'}
        </Text>
      </Card.Content>
    </Card>
  );
}
