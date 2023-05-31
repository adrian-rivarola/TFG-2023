import React from "react";

import CategoryTypeReport from "../components/reports/CategoryTypeReport";
import { CategoryType } from "../data";
import { RootTabScreenProps } from "../types";

type ScreenProps = RootTabScreenProps<"ReportsScreen">;

// TODO: Design this page
export default function Reports({ navigation, route }: ScreenProps) {
  return <CategoryTypeReport categoryType={CategoryType.expense} />;
}
