import dayjs from "dayjs";
import { Transaction } from "../data";

export function groupTransactionsByRange(
  transactions: Transaction[],
  range: "day" | "week"
) {
  if (range === "day") {
    return groupTransactionsByDay(transactions);
  }
  if (range === "week") {
    return groupTransactionsByWeek(transactions);
  }
  return {};
}

function groupTransactionsByDay(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    const transactionDate = dayjs(transaction.date);
    let key: string;

    switch (true) {
      case transactionDate.isSame(dayjs(), "day"):
        key = "Hoy";
        break;
      case transactionDate.isSame(dayjs().subtract(1, "day"), "day"):
        key = "Ayer";
        break;
      default:
        key = transactionDate.format("dddd, DD/MM");
        break;
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);

    return acc;
  }, {} as { [key: string]: Transaction[] });
}

function groupTransactionsByWeek(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    const transactionDate = dayjs(transaction.date);
    const key =
      transactionDate.startOf("week").format("DD/MM") +
      " - " +
      transactionDate.endOf("week").format("DD/MM");

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);

    return acc;
  }, {} as { [key: string]: Transaction[] });
}
