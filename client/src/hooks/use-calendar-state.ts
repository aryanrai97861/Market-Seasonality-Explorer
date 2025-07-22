import { useState, useMemo } from 'react';
import { ViewPeriod, CryptoPair } from '@/types/market-data';
import { getCurrentMonthDays } from '@/lib/date-utils';

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('daily');
  const [selectedSymbol, setSelectedSymbol] = useState<CryptoPair>('BTCUSDT');
  const [showMetrics, setShowMetrics] = useState({
    volatility: true,
    liquidity: true,
    performance: true,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    return getCurrentMonthDays(year, month);
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
    setSelectedDate(date);
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
    viewPeriod,
    selectedSymbol,
    showMetrics,
    calendarDays,
    year,
    month,
    navigateMonth,
    selectDate,
    setViewPeriod,
    setSelectedSymbol,
    toggleMetric,
  };
}
