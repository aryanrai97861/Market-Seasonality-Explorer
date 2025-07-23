import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { binanceWebSocket } from '@/lib/binance-websocket';
import { MarketDataPoint, CryptoPair } from '@/types/market-data';

export function useBinanceWebSocket(symbol: CryptoPair, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const connectedRef = useRef<boolean>(false);

  const handleMarketDataUpdate = useCallback((data: MarketDataPoint) => {
    // Update the market data cache with real-time data
    queryClient.setQueryData(['market-data', symbol], (oldData: MarketDataPoint[] | undefined) => {
      if (!oldData) return oldData;
      
      // Find existing data for today and update it, or add new data
      const today = new Date().toISOString().split('T')[0];
      const updatedData = [...oldData];
      const todayIndex = updatedData.findIndex(d => d.date === today);
      
      if (todayIndex >= 0) {
        // Update existing today's data
        updatedData[todayIndex] = {
          ...updatedData[todayIndex],
          ...data,
          // Keep the original date from the existing data
          date: updatedData[todayIndex].date
        };
      } else {
        // Add new data for today
        updatedData.push({
          ...data,
          date: today
        });
      }
      
      return updatedData.slice(-31); // Keep only last 31 days
    });

    // Update 24hr ticker cache
    queryClient.setQueryData(['24hr-ticker', symbol], () => ({
      symbol: data.symbol,
      priceChange: data.priceChange.toString(),
      priceChangePercent: data.priceChangePercent.toString(),
      lastPrice: data.closePrice.toString(),
      openPrice: data.openPrice.toString(),
      highPrice: data.highPrice.toString(),
      lowPrice: data.lowPrice.toString(),
      volume: data.volume.toString(),
      quoteVolume: data.liquidity?.toString() || '0',
      askPrice: (data.closePrice * 1.001).toString(), // Approximate
      bidPrice: (data.closePrice * 0.999).toString(), // Approximate
      openTime: Date.now() - 24 * 60 * 60 * 1000,
      closeTime: Date.now(),
      firstId: 0,
      lastId: 0,
      count: 0,
      weightedAvgPrice: data.closePrice.toString(),
      prevClosePrice: data.openPrice.toString(),
      lastQty: '0'
    }));
  }, [queryClient, symbol]);

  useEffect(() => {
    if (!enabled) return;

    // Subscribe to 24hr ticker for real-time price updates
    binanceWebSocket.subscribe24hrTicker(symbol, handleMarketDataUpdate);
    
    // Subscribe to 1-day klines for end-of-day data
    binanceWebSocket.subscribeKline(symbol, '1d', handleMarketDataUpdate);
    
    connectedRef.current = true;

    return () => {
      binanceWebSocket.unsubscribe(symbol, 'ticker');
      binanceWebSocket.unsubscribe(symbol, 'kline', '1d');
      connectedRef.current = false;
    };
  }, [symbol, enabled, handleMarketDataUpdate]);

  const isConnected = useCallback(() => {
    return binanceWebSocket.getConnectionStatus(symbol, 'ticker') || 
           binanceWebSocket.getConnectionStatus(symbol, 'kline', '1d');
  }, [symbol]);

  return {
    isConnected: isConnected(),
    connected: connectedRef.current
  };
}

export function useMultipleWebSocketConnections(symbols: CryptoPair[], enabled: boolean = true) {
  const connections = symbols.map(symbol => 
    useBinanceWebSocket(symbol, enabled)
  );

  return {
    connections,
    allConnected: connections.every(conn => conn.isConnected),
    anyConnected: connections.some(conn => conn.isConnected)
  };
}