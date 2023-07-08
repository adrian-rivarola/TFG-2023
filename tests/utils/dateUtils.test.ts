import dayjs from 'dayjs';
import 'dayjs/locale/es';
import MockDate from 'mockdate';

import { DateRange } from '@/types';
import { getDateInfo, getDatesFromRange, getGroupLabel } from '@/utils/dateUtils';

describe('getDatesFromRange', () => {
  beforeAll(() => {
    MockDate.set('2023-01-04'); // Wednesday
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should return a start and an end date', () => {
    const range = getDatesFromRange('week');

    expect(range).toHaveProperty('startDate');
    expect(range).toHaveProperty('endDate');
  });

  it('should return a start and an end date', () => {
    const { startDate, endDate } = getDatesFromRange('week');

    expect(startDate).toBe('2023-01-01');
    expect(endDate).toBe('2023-01-07');
  });

  it('should accept an positive offest', () => {
    const { startDate, endDate } = getDatesFromRange('week', 1);

    expect(startDate).toBe('2023-01-08');
    expect(endDate).toBe('2023-01-14');
  });

  it('should accept an negative offest', () => {
    const { startDate, endDate } = getDatesFromRange('week', -1);

    expect(startDate).toBe('2022-12-25');
    expect(endDate).toBe('2022-12-31');
  });
});

describe('getDateInfo', () => {
  beforeAll(() => {
    dayjs.locale('es');
  });

  it('should format dates in the same month', () => {
    const weekRange: DateRange = {
      startDate: '2023-01-01',
      endDate: '2023-01-10',
    };

    const monthRange = getDateInfo(weekRange);
    expect(monthRange).toBe('01 al 10 de enero');
  });

  it('should format dates in the different months', () => {
    const range: DateRange = {
      startDate: '2023-01-01',
      endDate: '2023-02-28',
    };

    const monthRange = getDateInfo(range);
    expect(monthRange).toBe('01 de enero al 28 de febrero');
  });
});

describe('getGroupLabel', () => {
  beforeAll(() => {
    dayjs.locale('es');
  });

  it('should return correct label for today', () => {
    const label = getGroupLabel(dayjs());
    expect(label).toBe('Hoy');
  });

  it('should return correct label for yesterday', () => {
    const label = getGroupLabel(dayjs().add(-1, 'day'));
    expect(label).toBe('Ayer');
  });

  it('should return correct label for previous dates', () => {
    const date = dayjs('2023-01-01');
    const label = getGroupLabel(date);

    let weekday = date.format('dddd');
    weekday = weekday[0].toUpperCase() + weekday.slice(1);

    expect(label).toBe(`${weekday}, 01 de enero`);
  });

  it('should return correct label for a month range', () => {
    const label = getGroupLabel(dayjs('2023-01-04'), 'month');
    expect(label).toBe('01/01 - 31/01');
  });
});
