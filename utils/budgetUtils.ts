import { Budget } from "../data";
import { getTotalsByDate } from "./chartUtils";

export function getBudgetStatusColor(percentage: number) {
  switch (true) {
    case percentage < 60:
      return "#47B39C";
    case percentage < 85:
      return "#FFC154";
    default:
      return "#EC6B56";
  }
}

export function getBudgetTrend(budget: Budget) {
  const { transactions = [], dateRange } = budget;
  const dateOffset = dateRange === "week" ? "day" : "week";

  const data = getTotalsByDate(transactions, dateRange, dateOffset, "ddd");

  let acc = 0;
  return {
    trend: Object.values(data).map((val) => (acc += val), acc),
    labels: Object.keys(data),
  };
}
