export interface MarketDataPoint {
  symbol: string;
  date: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  priceChange: number;
  priceChangePercent: number;
  volatility?: number;
  liquidity?: number;
}

export interface CalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  marketData?: MarketDataPoint;
  volatilityLevel: 'low' | 'medium' | 'high';
  performance: number;
  volume: number;
}

export interface VolatilityMetrics {
  stdDev: number;
  intradayRange: number;
  vixLike: 'Low' | 'Medium' | 'High';
}

export interface LiquidityMetrics {
  volume24h: number;
  bidAskSpread: number;
  marketDepth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export interface TechnicalIndicators {
  rsi: number;
  ma20: number;
  macd: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface DetailPanelData {
  date: string;
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  high: number;
  low: number;
  volatility: VolatilityMetrics;
  liquidity: LiquidityMetrics;
  technical: TechnicalIndicators;
}

export type ViewPeriod = 'daily' | 'weekly' | 'monthly';
export type CryptoPair = 'BTCUSDT' | 'ETHUSDT' | 'ADAUSDT' | 'SOLUSDT';

export interface QuickStatsData {
  avgVolatility: number;
  totalVolume: number;
  monthlyPerformance: number;
  highVolDays: number;
}
