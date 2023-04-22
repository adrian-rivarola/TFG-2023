import { Between, FindManyOptions, LessThan, MoreThanOrEqual } from "typeorm";
import { Transaction, dataSource } from "../data";
import dayjs from "dayjs";

type DateRange = "week" | "month" | "before";

const transactionRepository = dataSource.getRepository(Transaction);

const _getDateQuery = (range: DateRange) => {
  const operationFn = range === "before" ? LessThan : MoreThanOrEqual;
  const today = dayjs();
  const dateOffset =
    range === "week" ? today.subtract(7, "days") : today.subtract(1, "month");

  return operationFn(dateOffset.toDate());
};

export const getTransactions = async (
  options?: FindManyOptions<Transaction> | undefined
) => {
  return transactionRepository.find({ order: { date: "DESC" }, ...options });
};

export const getTransactionById = async (transactionId: number) => {
  return transactionRepository.findOne({
    where: { id: transactionId },
  });
};

export const getTransactionByDate = async (dateRange: DateRange) => {
  return transactionRepository.find({
    where: {
      date: _getDateQuery(dateRange),
    },
    order: {
      date: "DESC",
    },
  });
};

export const getTransactionsByCategory = async (
  categoryId: number,
  startDate: Date,
  endDate: Date
) => {
  const dateRange =
    startDate && endDate ? Between(startDate, endDate) : undefined;

  return transactionRepository.find({
    where: {
      category: {
        id: categoryId,
      },
      date: dateRange,
    },
    order: {
      date: "DESC",
    },
  });
};

export const createTransaction = async (transaction: Transaction) => {
  return transactionRepository.save(transaction);
};

export const updateTransaction = async (
  transactionId: number,
  payload: Partial<Transaction>
) => {
  const result = await transactionRepository.update(
    { id: transactionId },
    payload
  );
  return !!result.affected;
};

export const deleteTransaction = async (transactionId: number) => {
  const result = await transactionRepository.delete({ id: transactionId });
  return !!result.affected;
};

export const deleteAllTransactions = async () => {
  await transactionRepository.clear();
};
