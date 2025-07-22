import { CalendarDay } from '@/types/market-data';

export function getCurrentMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  
  const days: CalendarDay[] = [];
  
  // Add previous month days
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNumber);
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      volatilityLevel: 'low',
      performance: 0,
      volume: 0,
    });
  }
  
  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: day,
      isCurrentMonth: true,
      isToday,
      isSelected: false,
      volatilityLevel: 'low',
      performance: 0,
      volume: 0,
    });
  }
  
  // Add next month days to complete the grid (42 cells - 6 weeks)
  const remainingCells = 42 - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      volatilityLevel: 'low',
      performance: 0,
      volume: 0,
    });
  }
  
  return days;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(1)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}
