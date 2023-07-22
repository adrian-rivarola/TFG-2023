import React, { useState } from 'react';
import { FlatList, TouchableWithoutFeedback, View } from 'react-native';
import { Dialog, Portal, Searchbar } from 'react-native-paper';

import CategoryIcon from './CategoryIcon';
import { useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type IconSelectorProps = {
  icon?: string;
  isExpense?: boolean;
  onIconSelect: (icon: string) => void;
};

export default function IconSelector({ icon, isExpense, onIconSelect }: IconSelectorProps) {
  const {
    theme: { colors },
  } = useTheme();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const materialIcons = MaterialIcons.getRawGlyphMap();

  const closeDialog = () => {
    setVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          setVisible(true);
        }}
      >
        <CategoryIcon icon={(icon as any) || 'edit'} isExpense={isExpense} />
      </TouchableWithoutFeedback>

      <Portal>
        <Dialog
          style={{
            backgroundColor: colors.background,
          }}
          visible={visible}
          onDismiss={closeDialog}
        >
          <Dialog.Title
            style={{
              fontSize: 18,
            }}
          >
            Seleccionar ícono
          </Dialog.Title>

          <Dialog.ScrollArea
            style={{
              maxHeight: 500,
              paddingHorizontal: 0,
            }}
          >
            <Searchbar
              autoCapitalize="none"
              placeholder="Buscar"
              value={searchQuery}
              onChangeText={(val) => setSearchQuery(val)}
            />

            <FlatList
              style={{
                padding: 10,
                alignSelf: 'center',
              }}
              numColumns={5}
              data={Object.keys(materialIcons).filter((icon) =>
                icon.includes(searchQuery.toLowerCase())
              )}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  key={item}
                  onPress={() => {
                    onIconSelect(item);
                    closeDialog();
                  }}
                >
                  <View
                    style={{
                      padding: 5,
                    }}
                  >
                    <CategoryIcon icon={item} isExpense={isExpense} size={50} />
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </>
  );
}
