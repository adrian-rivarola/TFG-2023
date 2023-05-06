import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Transaction } from "../../data";

const WEEK_LABELS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export const REPORTS_QUERY_KEY = "reports";

const getWeekTotals = async () => {
  const weekStart = dayjs().startOf("week");
  const weekDates: string[] = [];

  for (let i = 0; i < 7; i++) {
    weekDates.push(weekStart.add(i, "days").format("YYYY-MM-DD"));
  }
  const weekData = await Transaction.getDailyTotals(
    weekDates[0],
    weekDates[weekDates.length - 1]
  );
  const weekReportData = weekDates.map(
    (d) => weekData.find((wd) => wd.date === d)?.total || 0
  );

  return {
    labels: WEEK_LABELS,
    datasets: [
      {
        data: weekReportData,
      },
    ],
  };
};

export function useWeekTotals() {
  return useQuery([REPORTS_QUERY_KEY, "week"], getWeekTotals);
}
