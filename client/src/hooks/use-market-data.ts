import { useQuery, useQueries } from '@tanstack/react-query';
import { binanceAPI } from '@/lib/binance-api';
import { MarketDataPoint, DetailPanelData, QuickStatsData, CryptoPair } from '@/types/market-data';
import { calculateRSI, calculateMovingAverage } from '@/lib/date-utils';
import { calculateEMA, calculateMACD } from '@/lib/indicators';

/**
 * Custom React hook to fetch historical market data for a given symbol from Binance.
 * Uses TanStack Query for caching and auto-refetching.
 * @param symbol - The crypto trading pair (e.g., 'BTCUSDT')
 * @param days - Number of days of history to fetch (default: 31)
 * @returns Query result with historical market data
 */
export function useMarketData(symbol: CryptoPair, days: number = 31) {
  return useQuery({
    queryKey: ['market-data', symbol, days],
    queryFn: () => binanceAPI.getHistoricalData(symbol, days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Fetches the 24hr ticker stats for a symbol from Binance.
 * @param symbol - Crypto trading pair
 * @returns Query result with 24hr ticker data
 */
export function use24hrTicker(symbol: CryptoPair) {
  return useQuery({
    queryKey: ['24hr-ticker', symbol],
    queryFn: () => binanceAPI.get24hrTicker(symbol),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Computes detailed metrics for the dashboard panel for a selected date and symbol.
 * Aggregates price, volatility, liquidity, and technical indicators (RSI, MA, MACD).
 * @param symbol - Crypto trading pair
 * @param selectedDate - Date string (YYYY-MM-DD)
 * @returns DetailPanelData or null if unavailable
 */
export function useDetailPanelData(symbol: CryptoPair, selectedDate: string | null): DetailPanelData | null {
  // Fetch more days to allow for rolling calculations (e.g. 50)
  const { data: marketData } = useMarketData(symbol, 50);
  const { data: ticker } = use24hrTicker(symbol);

  if (!marketData || !ticker || !selectedDate) return null;

  // Find index for selected date
  const idx = marketData.findIndex(d => d.date === selectedDate);
  if (idx === -1) return null;

  // Prepare arrays for indicator calculations up to and including selected day
  const closes = marketData.slice(0, idx + 1).map(d => d.closePrice);

  // Accurate RSI (last value)
  const rsi = calculateRSI(closes, 14);
  // Accurate MA20 (last value)
  const ma20 = calculateMovingAverage(closes, 20);
  // Accurate MACD (value, signal, histogram)
  const { macd, signal } = calculateMACD(closes);
  const macdValue = macd[macd.length - 1];
  const macdSignal = signal[signal.length - 1];

  // MACD trend label
  let macdLabel: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
  if (macdValue !== null && macdSignal !== null) {
    if (macdValue > macdSignal) macdLabel = 'Bullish';
    else if (macdValue < macdSignal) macdLabel = 'Bearish';
    else macdLabel = 'Neutral';
  }

  const dayData = marketData[idx];

  return {
    date: selectedDate,
    symbol,
    currentPrice: parseFloat(ticker.lastPrice),
    priceChange: parseFloat(ticker.priceChange),
    priceChangePercent: parseFloat(ticker.priceChangePercent),
    high: dayData.highPrice,
    low: dayData.lowPrice,
    volatility: {
      stdDev: dayData.volatility || 0,
      intradayRange: ((dayData.highPrice - dayData.lowPrice) / dayData.openPrice) * 100,
      vixLike: binanceAPI.calculateVolatilityLevel(dayData.volatility || 0) === 'high' ? 'High' : 
               binanceAPI.calculateVolatilityLevel(dayData.volatility || 0) === 'medium' ? 'Medium' : 'Low',
    },
    liquidity: {
      volume24h: parseFloat(ticker.volume),
      bidAskSpread: ((parseFloat(ticker.askPrice) - parseFloat(ticker.bidPrice)) / parseFloat(ticker.lastPrice)) * 100,
      marketDepth: parseFloat(ticker.volume) > 100000 ? 'Excellent' : 
                   parseFloat(ticker.volume) > 50000 ? 'Good' : 
                   parseFloat(ticker.volume) > 10000 ? 'Fair' : 'Poor',
    },
    technical: {
      rsi: typeof rsi === 'number' ? rsi : 50,
      ma20: typeof ma20 === 'number' ? ma20 : dayData.closePrice,
      macd: macdLabel,
      // For visualization
      rsiSeries: closes.length >= 14 ? closes.map((_, i, arr) => i >= 13 ? calculateRSI(arr.slice(0, i + 1), 14) : null) : [],
      ma20Series: closes.length >= 20 ? closes.map((_, i, arr) => i >= 19 ? calculateMovingAverage(arr.slice(0, i + 1), 20) : null) : [],
      macdSeries: macd,
      macdSignalSeries: signal,
      closes,
    },
  };
}

/**
 * Computes quick stats for the current symbol (avg volatility, total volume, monthly performance, high-vol days).
 * @param symbol - Crypto trading pair
 * @returns QuickStatsData or null if unavailable
 */
export function useQuickStats(symbol: CryptoPair): QuickStatsData | null {
  const { data: marketData } = useMarketData(symbol);

  if (!marketData) return null;

  const avgVolatility = marketData.reduce((sum, d) => sum + (d.volatility || 0), 0) / marketData.length;
  const totalVolume = marketData.reduce((sum, d) => sum + (d.liquidity || 0), 0);
  const monthlyPerformance = marketData.length > 0 ? 
    ((marketData[marketData.length - 1].closePrice - marketData[0].openPrice) / marketData[0].openPrice) * 100 : 0;
  const highVolDays = marketData.filter(d => binanceAPI.calculateVolatilityLevel(d.volatility || 0) === 'high').length;

  return {
    avgVolatility,
    totalVolume,
    monthlyPerformance,
    highVolDays,
  };
}

/**
 * Fetches market data for multiple symbols in parallel using useQueries.
 * @param symbols - Array of crypto trading pairs
 * @returns Array of query results for each symbol
 */
export function useMultipleSymbolData(symbols: CryptoPair[]) {
  return useQueries({
    queries: symbols.map(symbol => ({
      queryKey: ['market-data', symbol],
      queryFn: () => binanceAPI.getHistoricalData(symbol),
      staleTime: 5 * 60 * 1000,
    }))
  });
}
