import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Surface, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import { Budget } from "../../data";
import CategoryIcon from "../category/CategoryIcon";
import BudgetPercentageBar from "./BudgetPercentageBar";

type BudgetGroupProps = {
  title: string;
  budgets: Budget[];
};

export function BudgetGroup({ budgets, title }: BudgetGroupProps) {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation();

  const themedStyles = StyleSheet.create({
    surfaceStyle: {
      backgroundColor: colors.background,
      marginHorizontal: 10,
      marginBottom: 15,
      borderRadius: 10,
      padding: 10,
    },
  });

  if (budgets.length === 0) {
    return null;
  }

  return (
    <View style={{ marginBottom: 30 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Text variant="labelLarge">{title}</Text>
      </View>

      {budgets.map((budget) => (
        <Surface
          key={budget.id}
          elevation={1}
          style={themedStyles.surfaceStyle}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BudgetDetails", {
                budgetId: budget.id,
              });
            }}
          >
            <Badge
              style={{
                position: "absolute",
                right: -15,
                top: -15,
                backgroundColor: "#EC6B56",
              }}
              visible={budget.totalSpent >= budget.maxAmount}
              size={15}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <CategoryIcon
                style={{ marginEnd: 10 }}
                category={budget.categories[0]}
                size={40}
              />

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Text variant="labelLarge">{budget.description}</Text>
                  <Text variant="labelSmall">
                    {Math.floor((budget.totalSpent / budget.maxAmount) * 100)}%
                  </Text>
                </View>

                <BudgetPercentageBar budget={budget} />
              </View>
            </View>
          </TouchableOpacity>
        </Surface>
      ))}
    </View>
  );
}
