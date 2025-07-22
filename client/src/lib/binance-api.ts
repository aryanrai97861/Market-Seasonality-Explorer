import { MarketDataPoint } from '@/types/market-data';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

export interface BinanceKlineData {
  symbol: string;
  interval: string;
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export class BinanceAPI {
  private baseURL = BINANCE_BASE_URL;

  async get24hrTicker(symbol: string): Promise<Binance24hrTicker> {
    try {
      const response = await fetch(`${this.baseURL}/ticker/24hr?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch 24hr ticker: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching 24hr ticker:', error);
      throw error;
    }
  }

  async getKlines(
    symbol: string, 
    interval: string = '1d', 
    startTime?: number, 
    endTime?: number,
    limit: number = 31
  ): Promise<any[]> {
    try {
      let url = `${this.baseURL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      
      if (startTime) {
        url += `&startTime=${startTime}`;
      }
      if (endTime) {
        url += `&endTime=${endTime}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch klines: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching klines:', error);
      throw error;
    }
  }

  async getHistoricalData(symbol: string, days: number = 31): Promise<MarketDataPoint[]> {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);
      
      const klines = await this.getKlines(symbol, '1d', startTime, endTime, days);
      
      return klines.map((kline) => {
        const [
          openTime,
          open,
          high,
          low,
          close,
          volume,
          closeTime,
          quoteAssetVolume,
          numberOfTrades,
          takerBuyBaseAssetVolume,
          takerBuyQuoteAssetVolume
        ] = kline;

        const openPrice = parseFloat(open);
        const closePrice = parseFloat(close);
        const priceChange = closePrice - openPrice;
        const priceChangePercent = (priceChange / openPrice) * 100;

        // Calculate volatility as the percentage range
        const volatility = ((parseFloat(high) - parseFloat(low)) / parseFloat(open)) * 100;

        return {
          symbol,
          date: new Date(openTime).toISOString().split('T')[0],
          openPrice,
          closePrice,
          highPrice: parseFloat(high),
          lowPrice: parseFloat(low),
          volume: parseFloat(volume),
          priceChange,
          priceChangePercent,
          volatility,
          liquidity: parseFloat(quoteAssetVolume), // Use quote volume as liquidity proxy
        };
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  calculateVolatilityLevel(volatility: number): 'low' | 'medium' | 'high' {
    if (volatility < 2) return 'low';
    if (volatility < 5) return 'medium';
    return 'high';
  }
}

export const binanceAPI = new BinanceAPI();
