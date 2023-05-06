import dayjs from "dayjs";
import { LessThan, MoreThanOrEqual } from "typeorm";

export type DateRange = "week" | "month" | "before";

export const getDatesFromRange = (range: DateRange) => {
  const operationFn = range === "before" ? LessThan : MoreThanOrEqual;
  const today = dayjs().startOf("day");
  const dateOffset =
    range === "week" ? today.subtract(7, "days") : today.subtract(1, "month");

  return operationFn(dateOffset.toDate());
};
