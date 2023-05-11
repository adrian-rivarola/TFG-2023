import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

type FormScreens = "BudgetForm" | "TransactionForm" | "CategoryForm";
type CustomFABProps = {
  destination: FormScreens;
};

export default function CustomFAB({ destination }: CustomFABProps) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const focusedRoute = getFocusedRouteNameFromRoute(route) || "Home";
  const visible = isFocused && focusedRoute !== "Configuration";

  const onPress = () => {
    navigation.navigate(destination);
  };

  return (
    <FAB
      visible={visible}
      icon="plus"
      variant="primary"
      style={styles.fabStyle}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
