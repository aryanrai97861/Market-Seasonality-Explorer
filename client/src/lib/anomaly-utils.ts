import { CalendarDay } from '@/types/market-data';

/**
 * Detects anomalies and recurrences in a month's calendar days.
 * - Anomalies: days with volatility, volume, or performance > 2 std deviations from the mean.
 * - Recurrences: same day-of-month with repeated strong moves in history (stub).
 * Adds anomalyType: 'anomaly' | 'recurrence' | null to CalendarDay.
 */
export function detectAnomaliesInCalendarDays(calendarDays: CalendarDay[]): CalendarDay[] {
  // Only consider current month days for anomaly detection
  const currentMonthDays = calendarDays.filter(d => d.isCurrentMonth);
  const vols = currentMonthDays.map(d => d.marketData?.volatility ?? 0);
  const volsMean = mean(vols);
  const volsStd = std(vols);
  const volsThreshold = volsMean + 2 * volsStd;

  const volsLowThreshold = volsMean - 2 * volsStd;

  const perfs = currentMonthDays.map(d => d.performance);
  const perfsMean = mean(perfs);
  const perfsStd = std(perfs);
  const perfsThreshold = perfsMean + 2 * perfsStd;
  const perfsLowThreshold = perfsMean - 2 * perfsStd;

  const volsAnomaly = (v?: number) => v !== undefined && (v > volsThreshold || v < volsLowThreshold);
  const perfAnomaly = (p: number) => p > perfsThreshold || p < perfsLowThreshold;

  return calendarDays.map(day => {
    let anomalyType: 'anomaly' | 'recurrence' | null = null;
    if (day.isCurrentMonth) {
      if (volsAnomaly(day.marketData?.volatility) || perfAnomaly(day.performance)) {
        anomalyType = 'anomaly';
      }
      // Recurrence logic could be added here (e.g., if this day-of-month is often anomalous in history)
    }
    return { ...day, anomalyType };
  });
}

function mean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[]): number {
  if (!arr.length) return 0;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((acc, val) => acc + (val - m) ** 2, 0) / arr.length);
}
