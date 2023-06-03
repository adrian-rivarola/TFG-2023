import dayjs from "dayjs";

export type StringDateRange = "week" | "month";
export type DateRange = { startDate: string; endDate: string };

export const DATE_FORMAT = "YYYY-MM-DD";

export function getDatesFromRange(
  range: StringDateRange,
  offset = 0
): DateRange {
  const startDate = dayjs().startOf(range).add(offset, range);
  const endDate = dayjs().endOf(range).add(offset, range);

  return {
    startDate: startDate.format(DATE_FORMAT),
    endDate: endDate.format(DATE_FORMAT),
  };
}

export function getDateInfo(range: DateRange) {
  const startDate = dayjs(range.startDate);
  const endDate = dayjs(range.endDate);

  if (startDate.isSame(endDate, "month")) {
    return `${startDate.format("D")} al ${endDate.format("D [de] MMMM")}`;
  } else {
    return `${startDate.format("D [de] MMMM")} al ${endDate.format(
      "D [de] MMMM"
    )}`;
  }
}
