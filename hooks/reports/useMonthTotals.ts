import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "react-query";
import { Transaction } from "../../data";
import { REPORTS_QUERY_KEY } from "./useWeekTotals";

const getMonthTotals = async () => {
  let monthStart = dayjs().startOf("month").startOf("day");
  // get first monday
  while (monthStart.day() !== 1) {
    monthStart = monthStart.subtract(1, "day");
  }

  const monthDates: Dayjs[] = [];

  for (let i = 0; i < 4; i++) {
    monthDates.push(monthStart.add(i, "weeks"));
  }

  const monthData = await Transaction.getWeeklyTotals({
    startDate: monthDates[0].format("YYYY-MM-DD"),
    endDate: monthStart.add(4, "weeks").format("YYYY-MM-DD"),
  });
  const monthReportData = monthDates.map(
    (d) =>
      monthData.find((md) => d.isSame(md.weekStart, "day"))
        ?.totalTransactions || 0
  );
  return {
    labels: monthDates.map((d) => d.format("DD/MM")),
    datasets: [
      {
        data: monthReportData,
      },
    ],
  };
};

export function useMonthTotals() {
  return useQuery([REPORTS_QUERY_KEY, "month"], getMonthTotals);
}
