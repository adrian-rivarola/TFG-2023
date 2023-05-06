import React from "react";
import { StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";

export default function CustomFAB({ onPress }: { onPress: () => void }) {
  const themedStyles = StyleSheet.create({
    fabStyle: {
      position: "absolute",
      margin: 20,
      right: 0,
      bottom: 70,
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Portal>
      <FAB
        icon="plus"
        variant="primary"
        style={themedStyles.fabStyle}
        onPress={onPress}
      />
    </Portal>
  );
}
