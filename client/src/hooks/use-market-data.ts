import { useQuery, useQueries } from '@tanstack/react-query';
import { binanceAPI } from '@/lib/binance-api';
import { MarketDataPoint, DetailPanelData, QuickStatsData, CryptoPair } from '@/types/market-data';

export function useMarketData(symbol: CryptoPair, days: number = 31) {
  return useQuery({
    queryKey: ['market-data', symbol, days],
    queryFn: () => binanceAPI.getHistoricalData(symbol, days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function use24hrTicker(symbol: CryptoPair) {
  return useQuery({
    queryKey: ['24hr-ticker', symbol],
    queryFn: () => binanceAPI.get24hrTicker(symbol),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useDetailPanelData(symbol: CryptoPair, selectedDate: string | null): DetailPanelData | null {
  const { data: marketData } = useMarketData(symbol);
  const { data: ticker } = use24hrTicker(symbol);

  if (!marketData || !ticker || !selectedDate) return null;

  const dayData = marketData.find(d => d.date === selectedDate);
  if (!dayData) return null;

  // Calculate technical indicators (simplified)
  const rsi = Math.min(100, Math.max(0, 50 + (dayData.priceChangePercent * 2)));
  const ma20 = marketData.slice(-20).reduce((sum, d) => sum + d.closePrice, 0) / Math.min(20, marketData.length);
  
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
      rsi,
      ma20,
      macd: dayData.priceChangePercent > 0 ? 'Bullish' : dayData.priceChangePercent < 0 ? 'Bearish' : 'Neutral',
    },
  };
}

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

export function useMultipleSymbolData(symbols: CryptoPair[]) {
  return useQueries({
    queries: symbols.map(symbol => ({
      queryKey: ['market-data', symbol],
      queryFn: () => binanceAPI.getHistoricalData(symbol),
      staleTime: 5 * 60 * 1000,
    }))
  });
}
