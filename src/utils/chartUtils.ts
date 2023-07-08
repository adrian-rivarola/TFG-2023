import dayjs from 'dayjs';

import { DateAmountEntity, StringDateRange } from '@/types';

export function getTotalsByDate<T extends DateAmountEntity>(
  entities: T[],
  range: StringDateRange,
  dateOffset: StringDateRange,
  dateFormat = 'DD/MM'
) {
  let startDate = dayjs().startOf(range);
  const endDate = dayjs().endOf(range);
  const data: number[] = [];

  entities.forEach((entity) => {
    const idx = Math.abs(startDate.diff(entity.date, dateOffset));
    data[idx] = (data[idx] || 0) + entity.amount;
  });

  const res: Record<string, number> = {};
  let dataIdx = 0;
  while (!startDate.isAfter(endDate, 'day')) {
    const key = startDate.format(dateFormat);
    res[key] = data[dataIdx] || 0;

    dataIdx++;
    startDate = startDate.add(1, dateOffset);
  }

  return res;
}
