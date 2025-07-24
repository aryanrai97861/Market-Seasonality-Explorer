import { useState, useMemo } from 'react';
import { ViewPeriod, CryptoPair } from '@/types/market-data';
import { getCurrentMonthDays } from '@/lib/date-utils';
import { detectAnomaliesInCalendarDays } from '@/lib/anomaly-utils';

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('daily');
  const [selectedSymbol, setSelectedSymbol] = useState<CryptoPair>('BTCUSDT');
  const [showMetrics, setShowMetrics] = useState({
    volatility: true,
    liquidity: true,
    performance: true,
  });
  const [colorScheme, setColorScheme] = useState<'default' | 'colorblind' | 'high-contrast'>('default');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const days = getCurrentMonthDays(year, month);
    return detectAnomaliesInCalendarDays(days);
  }, [year, month]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const selectDate = (date: string) => {
    if (isRangeSelection) {
      if (!selectedDateRange.start || (selectedDateRange.start && selectedDateRange.end)) {
        setSelectedDateRange({ start: date, end: null });
      } else {
        const start = new Date(selectedDateRange.start);
        const end = new Date(date);
        if (end < start) {
          setSelectedDateRange({ start: date, end: selectedDateRange.start });
        } else {
          setSelectedDateRange({ start: selectedDateRange.start, end: date });
        }
      }
    } else {
      setSelectedDate(date);
    }
  };

  const toggleRangeSelection = () => {
    setIsRangeSelection(!isRangeSelection);
    setSelectedDateRange({ start: null, end: null });
    setSelectedDate(null);
  };

  const toggleMetric = (metric: keyof typeof showMetrics) => {
    setShowMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return {
    currentDate,
    selectedDate,
    selectedDateRange,
    isRangeSelection,
    viewPeriod,
    selectedSymbol,
    showMetrics,
    colorScheme,
    calendarDays,
    year,
    month,
    navigateMonth,
    selectDate,
    toggleRangeSelection,
    setViewPeriod,
    setSelectedSymbol,
    setColorScheme,
    toggleMetric,
  };
}
