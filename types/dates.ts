import { Dayjs } from 'dayjs';

export type DateAmountEntity = {
  date: string | Dayjs | Date;
  amount: number;
};

export type StringDateRange = 'day' | 'week' | 'month';

export type DateRange = { startDate: string; endDate: string };
