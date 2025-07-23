import { MarketDataPoint } from '@/types/market-data';

interface BinanceWebSocketData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Volume
  q: string; // Quote volume
  P: string; // Price change percent
}

interface BinanceKlineData {
  e: string;
  E: number;
  s: string;
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
  };
}

export class BinanceWebSocket {
  private sockets: Map<string, WebSocket> = new Map();
  private callbacks: Map<string, (data: MarketDataPoint) => void> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  subscribe24hrTicker(symbol: string, callback: (data: MarketDataPoint) => void) {
    const streamName = `${symbol.toLowerCase()}@ticker`;
    this.callbacks.set(streamName, callback);
    this.connect(streamName, symbol);
  }

  subscribeKline(symbol: string, interval: string = '1d', callback: (data: MarketDataPoint) => void) {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    this.callbacks.set(streamName, callback);
    this.connect(streamName, symbol);
  }

  private connect(streamName: string, symbol: string) {
    if (this.sockets.has(streamName)) {
      this.sockets.get(streamName)?.close();
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log(`WebSocket connected for ${streamName}`);
      this.reconnectAttempts.set(streamName, 0);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const callback = this.callbacks.get(streamName);
        
        if (callback) {
          if (data.e === '24hrTicker') {
            const tickerData = data as BinanceWebSocketData;
            const marketData = this.transformTickerData(tickerData);
            callback(marketData);
          } else if (data.e === 'kline' && data.k.x) { // Only process closed klines
            const klineData = data as BinanceKlineData;
            const marketData = this.transformKlineData(klineData);
            callback(marketData);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed for ${streamName}:`, event.code, event.reason);
      this.handleReconnect(streamName, symbol);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${streamName}:`, error);
    };

    this.sockets.set(streamName, socket);
  }

  private handleReconnect(streamName: string, symbol: string) {
    const attempts = this.reconnectAttempts.get(streamName) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(streamName, attempts + 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect ${streamName} (attempt ${attempts + 1})`);
        this.connect(streamName, symbol);
      }, this.reconnectDelay * Math.pow(2, attempts)); // Exponential backoff
    } else {
      console.error(`Max reconnection attempts reached for ${streamName}`);
    }
  }

  private transformTickerData(data: BinanceWebSocketData): MarketDataPoint {
    const openPrice = parseFloat(data.o);
    const closePrice = parseFloat(data.c);
    const priceChange = closePrice - openPrice;
    const priceChangePercent = parseFloat(data.P);
    
    // Calculate volatility as the percentage range
    const volatility = ((parseFloat(data.h) - parseFloat(data.l)) / openPrice) * 100;

    return {
      symbol: data.s,
      date: new Date().toISOString().split('T')[0],
      openPrice,
      closePrice,
      highPrice: parseFloat(data.h),
      lowPrice: parseFloat(data.l),
      volume: parseFloat(data.v),
      priceChange,
      priceChangePercent,
      volatility,
      liquidity: parseFloat(data.q),
    };
  }

  private transformKlineData(data: BinanceKlineData): MarketDataPoint {
    const openPrice = parseFloat(data.k.o);
    const closePrice = parseFloat(data.k.c);
    const priceChange = closePrice - openPrice;
    const priceChangePercent = (priceChange / openPrice) * 100;
    
    // Calculate volatility as the percentage range
    const volatility = ((parseFloat(data.k.h) - parseFloat(data.k.l)) / openPrice) * 100;

    return {
      symbol: data.k.s,
      date: new Date(data.k.t).toISOString().split('T')[0],
      openPrice,
      closePrice,
      highPrice: parseFloat(data.k.h),
      lowPrice: parseFloat(data.k.l),
      volume: parseFloat(data.k.v),
      priceChange,
      priceChangePercent,
      volatility,
      liquidity: parseFloat(data.k.q),
    };
  }

  unsubscribe(symbol: string, type: 'ticker' | 'kline' = 'ticker', interval?: string) {
    const streamName = type === 'ticker' 
      ? `${symbol.toLowerCase()}@ticker`
      : `${symbol.toLowerCase()}@kline_${interval || '1d'}`;
    
    const socket = this.sockets.get(streamName);
    if (socket) {
      socket.close();
      this.sockets.delete(streamName);
      this.callbacks.delete(streamName);
      this.reconnectAttempts.delete(streamName);
    }
  }

  unsubscribeAll() {
    this.sockets.forEach((socket, streamName) => {
      socket.close();
    });
    
    this.sockets.clear();
    this.callbacks.clear();
    this.reconnectAttempts.clear();
  }

  getConnectionStatus(symbol: string, type: 'ticker' | 'kline' = 'ticker', interval?: string): boolean {
    const streamName = type === 'ticker' 
      ? `${symbol.toLowerCase()}@ticker`
      : `${symbol.toLowerCase()}@kline_${interval || '1d'}`;
    
    const socket = this.sockets.get(streamName);
    return socket ? socket.readyState === WebSocket.OPEN : false;
  }
}

export const binanceWebSocket = new BinanceWebSocket();