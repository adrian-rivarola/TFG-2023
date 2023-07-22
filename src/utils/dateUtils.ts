import dayjs, { Dayjs } from 'dayjs';

import { DateRange, StringDateRange } from '@/types';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function getDatesFromRange(range: StringDateRange, offset = 0): DateRange {
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

  if (startDate.isSame(endDate, 'month')) {
    return `${startDate.format('DD')} al ${endDate.format('DD [de] MMMM')}`;
  } else {
    return `${startDate.format('DD [de] MMMM')} al ${endDate.format('DD [de] MMMM')}`;
  }
}

export function getGroupLabel(date: Dayjs, groupRange: StringDateRange = 'day') {
  if (groupRange !== 'day') {
    return (
      date.startOf(groupRange).format('DD/MM') + ' - ' + date.endOf(groupRange).format('DD/MM')
    );
  }

  let label: string;
  switch (true) {
    case date.isSame(dayjs(), 'day'):
      label = 'Hoy';
      break;
    case date.isSame(dayjs().subtract(1, 'day'), 'day'):
      label = 'Ayer';
      break;
    default:
      label = date.format('dddd, DD [de] MMMM');
      label = label[0].toUpperCase() + label.slice(1);
      break;
  }

  return label;
}
