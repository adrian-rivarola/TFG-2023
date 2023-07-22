import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { FAB } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

import { DateRange } from '@/types';
import { DATE_FORMAT, getDatesFromRange } from '@/utils/dateUtils';
import { useIsFocused } from '@react-navigation/native';

type DateFilterFABProps = {
  initialRange?: DateRange;
  onChange(dateRange?: DateRange): void;
};
type DateFilterOptions = 'week' | 'month' | 'custom';
type FABAction = {
  labelStyle: StyleProp<TextStyle>;
  size: 'small' | 'medium';
};

export default function DateFilterFAB({ initialRange, onChange }: DateFilterFABProps) {
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState(initialRange || getDatesFromRange('week'));
  const [selectedRange, setSelectedRange] = useState<DateFilterOptions>();

  useEffect(() => {
    if (!isFocused) {
      setOpen(false);
    }
  }, [isFocused]);

  const getActionStyle = (range: DateFilterOptions): FABAction => {
    const size = selectedRange === range ? 'medium' : 'small';
    const fontWeight = selectedRange === range ? 'bold' : 'normal';

    return {
      size,
      labelStyle: {
        fontWeight,
      },
    };
  };

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <FAB.Group
        visible
        open={open}
        style={{
          right: 5,
        }}
        fabStyle={{
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        icon="calendar-today"
        actions={[
          {
            label: 'Esta semana',
            icon: 'calendar-range',
            ...getActionStyle('week'),
            onPress: () => {
              const newRange = getDatesFromRange('week');
              setSelectedRange('week');
              onChange(newRange);
              setRange(newRange);
            },
          },
          {
            label: 'Este mes',
            icon: 'calendar-month',
            ...getActionStyle('month'),
            onPress: () => {
              const newRange = getDatesFromRange('month');
              setSelectedRange('month');
              onChange(newRange);
              setRange(newRange);
            },
          },
          {
            label: 'Personalizar',
            icon: 'calendar-edit',
            ...getActionStyle('custom'),
            onPress: () => {
              setOpen(false);
              setOpenDateModal(true);
            },
          },
          {
            icon: 'calendar-remove',
            label: 'Remover filtro',
            onPress: () => {
              setSelectedRange(undefined);
              onChange();
            },
          },
        ]}
        onStateChange={({ open }) => setOpen(open)}
      />

      <DatePickerModal
        locale="en"
        mode="range"
        visible={openDateModal}
        onDismiss={() => setOpenDateModal(false)}
        startDate={dayjs(range.startDate).toDate()}
        endDate={dayjs(range.endDate).toDate()}
        onConfirm={(range) => {
          setOpenDateModal(false);
          const { startDate, endDate } = range;
          if (startDate !== undefined && endDate !== undefined) {
            const newRange = {
              startDate: dayjs(startDate).format(DATE_FORMAT),
              endDate: dayjs(endDate).format(DATE_FORMAT),
            };
            setSelectedRange('custom');
            onChange(newRange);
            setRange(newRange);
          }
        }}
        dateMode="start"
      />
    </>
  );
}
