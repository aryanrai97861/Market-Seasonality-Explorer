// Accurate indicator calculation utilities: EMA, MACD, etc.

/**
 * Calculate Exponential Moving Average (EMA)
 * @param values Array of prices
 * @param period Number of periods
 * @returns EMA array (same length as input, first (period-1) are null)
 */
export function calculateEMA(values: number[], period: number): (number | null)[] {
  if (values.length < period) return Array(values.length).fill(null);
  const k = 2 / (period + 1);
  const emaArr: (number | null)[] = [];
  let emaPrev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      emaArr.push(null);
    } else if (i === period - 1) {
      // SMA for first EMA value
      const sma = values.slice(0, period).reduce((sum, v) => sum + v, 0) / period;
      emaArr.push(sma);
      emaPrev = sma;
    } else {
      emaPrev = (values[i] - (emaPrev as number)) * k + (emaPrev as number);
      emaArr.push(emaPrev);
    }
  }
  return emaArr;
}

/**
 * Calculate MACD and Signal Line
 * @param values Array of prices
 * @param fastPeriod Usually 12
 * @param slowPeriod Usually 26
 * @param signalPeriod Usually 9
 * @returns { macd: (number|null)[], signal: (number|null)[], histogram: (number|null)[] }
 */
export function calculateMACD(
  values: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: (number|null)[], signal: (number|null)[], histogram: (number|null)[] } {
  const emaFast = calculateEMA(values, fastPeriod);
  const emaSlow = calculateEMA(values, slowPeriod);
  const macdArr: (number|null)[] = values.map((_, i) => {
    if (emaFast[i] === null || emaSlow[i] === null) return null;
    return (emaFast[i] as number) - (emaSlow[i] as number);
  });
  const signalArr = calculateEMA(macdArr.map(v => v ?? 0), signalPeriod);
  const histogramArr = macdArr.map((macd, i) =>
    macd !== null && signalArr[i] !== null ? macd - (signalArr[i] as number) : null
  );
  return { macd: macdArr, signal: signalArr, histogram: histogramArr };
}
