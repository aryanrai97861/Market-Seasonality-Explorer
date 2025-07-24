import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Order {
  price: number;
  quantity: number;
}

interface OrderbookData {
  bids: Order[];
  asks: Order[];
}

/**
 * Props for OrderbookPanel component.
 * @property symbol - The crypto trading pair to subscribe to (e.g., 'BTCUSDT')
 */
interface OrderbookPanelProps {
  symbol: string;
}

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

/**
 * OrderbookPanel subscribes to Binance WebSocket for orderbook data and displays top 10 bids/asks.
 * Shows loading state, handles connection errors, and renders orderbook tables.
 * @param symbol - Crypto trading pair
 */
export default function OrderbookPanel({ symbol }: OrderbookPanelProps) {
  const [orderbook, setOrderbook] = useState<OrderbookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}@depth20@100ms`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.bids && data.asks) {
        setOrderbook({
          bids: data.bids.slice(0, 10).map(([price, quantity]: [string, string]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity)
          })),
          asks: data.asks.slice(0, 10).map(([price, quantity]: [string, string]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity)
          }))
        });
        setLoading(false);
      }
    };
    ws.onerror = () => setLoading(false);
    ws.onclose = () => setLoading(false);
    return () => ws.close();
  }, [symbol]);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mt-4">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
        Orderbook (Top 10)
      </h3>
      {loading && (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      )}
      {!loading && orderbook && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-green-400 font-medium mb-1">Bids</div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-400">Price</th>
                  <th className="text-right text-gray-400">Qty</th>
                </tr>
              </thead>
              <tbody>
                {orderbook.bids.map((bid, idx) => (
                  <tr key={idx}>
                    <td className="text-green-300">{bid.price.toFixed(2)}</td>
                    <td className="text-right text-white">{bid.quantity.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-red-400 font-medium mb-1">Asks</div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-400">Price</th>
                  <th className="text-right text-gray-400">Qty</th>
                </tr>
              </thead>
              <tbody>
                {orderbook.asks.map((ask, idx) => (
                  <tr key={idx}>
                    <td className="text-red-300">{ask.price.toFixed(2)}</td>
                    <td className="text-right text-white">{ask.quantity.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!loading && !orderbook && (
        <div className="text-center text-gray-400">No orderbook data available.</div>
      )}
    </div>
  );
}
