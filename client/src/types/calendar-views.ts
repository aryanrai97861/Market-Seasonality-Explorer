export type CalendarViewType = 'daily' | 'weekly' | 'monthly';

export interface CalendarViewConfig {
  type: CalendarViewType;
  title: string;
  columns: number;
  rows: number;
}

export const CALENDAR_VIEWS: Record<CalendarViewType, CalendarViewConfig> = {
  daily: {
    type: 'daily',
    title: 'Daily View',
    columns: 7,
    rows: 6
  },
  weekly: {
    type: 'weekly',
    title: 'Weekly View',
    columns: 7,
    rows: 4
  },
  monthly: {
    type: 'monthly',
    title: 'Monthly View',
    columns: 3,
    rows: 4
  }
};