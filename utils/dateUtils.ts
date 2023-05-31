import dayjs from "dayjs";

export const DATE_FORMAT = "YYYY-MM-DD";

export type StringDateRange = "week" | "month";
export type DateRange = { startDate: string; endDate: string };

export const getDatesFromRange = (range: StringDateRange): DateRange => {
  const startDate = dayjs().startOf(range);
  const endDate = dayjs().endOf(range);

  return {
    startDate: startDate.format(DATE_FORMAT),
    endDate: endDate.format(DATE_FORMAT),
  };
};
