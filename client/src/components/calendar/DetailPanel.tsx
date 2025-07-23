import { motion } from 'framer-motion';
import { TrendingUp, Activity, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderbookPanel from './OrderbookPanel';
import IndicatorMiniChart from './IndicatorMiniChart';
import { DetailPanelData } from '@/types/market-data';
import { formatCurrency, formatVolume, formatPercentage } from '@/lib/date-utils';

interface DetailPanelProps {
  data: DetailPanelData | null;
}

const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function DetailPanel({ data }: DetailPanelProps) {
  if (!data) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
        <div className="text-center text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a date to view detailed analysis</p>
        </div>
      </div>
    );
  }

  const getVolatilityColor = () => {
    switch (data.volatility.vixLike) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getLiquidityColor = () => {
    switch (data.liquidity.marketDepth) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMacdColor = () => {
    switch (data.technical.macd) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      case 'Neutral': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {new Date(data.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h3>
        <div className={`w-4 h-4 rounded ${
          data.volatility.vixLike === 'High' ? 'volatility-high' :
          data.volatility.vixLike === 'Medium' ? 'volatility-medium' :
          'volatility-low'
        }`} />
      </motion.div>

      {/* Price Summary */}
      <motion.div variants={itemVariants} className="space-y-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Price</span>
            <span className={`text-sm font-medium ${
              data.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(data.priceChangePercent)}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(data.currentPrice)}
          </div>
          <div className="text-gray-400 text-sm">{data.symbol.replace('USDT', '/USDT')}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-700 rounded-lg p-3"
          >
            <div className="text-gray-400 text-xs mb-1">High</div>
            <div className="text-white font-semibold">{formatCurrency(data.high)}</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-700 rounded-lg p-3"
          >
            <div className="text-gray-400 text-xs mb-1">Low</div>
            <div className="text-white font-semibold">{formatCurrency(data.low)}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Volatility Metrics */}
      <motion.div variants={itemVariants} className="mb-6">
        <h4 className="text-md font-medium text-white mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Volatility Analysis
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Standard Deviation</span>
            <span className="text-white font-medium">{data.volatility.stdDev.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Intraday Range</span>
            <span className="text-white font-medium">{data.volatility.intradayRange.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">VIX-like Index</span>
            <span className={`font-medium ${getVolatilityColor()}`}>{data.volatility.vixLike}</span>
          </div>
        </div>
      </motion.div>

      {/* Liquidity Metrics */}
      <motion.div variants={itemVariants} className="mb-6">
        <h4 className="text-md font-medium text-white mb-3 flex items-center">
          <Droplets className="w-4 h-4 mr-2" />
          Liquidity Analysis
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">24h Volume</span>
            <span className="text-white font-medium">{formatVolume(data.liquidity.volume24h)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Bid-Ask Spread</span>
            <span className="text-white font-medium">{data.liquidity.bidAskSpread.toFixed(3)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Market Depth</span>
            <span className={`font-medium ${getLiquidityColor()}`}>{data.liquidity.marketDepth}</span>
          </div>
        </div>
      </motion.div>

      {/* Technical Indicators */}
      <motion.div variants={itemVariants} className="mb-6">
        <h4 className="text-md font-medium text-white mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Technical Indicators
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">RSI (14)</span>
            <span className="flex items-center gap-2">
              <span className="text-white font-medium">{data.technical.rsi.toFixed(1)}</span>
              {data.technical.rsiSeries && (
                <IndicatorMiniChart
                  data={data.technical.rsiSeries}
                  color="#60a5fa"
                  overbought={70}
                  oversold={30}
                  min={0}
                  max={100}
                  label="RSI"
                />
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">MA (20)</span>
            <span className="flex items-center gap-2">
              <span className="text-white font-medium">{formatCurrency(data.technical.ma20)}</span>
              {data.technical.ma20Series && data.technical.closes && (
                <IndicatorMiniChart
                  data={data.technical.closes}
                  color="#38bdf8"
                  label="Price"
                />
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">MACD</span>
            <span className="flex items-center gap-2">
              <span className={`font-medium ${getMacdColor()}`}>{data.technical.macd}</span>
              {data.technical.macdSeries && data.technical.macdSignalSeries && (
                <svg width={80} height={36} className="block">
                  {/* MACD line */}
                  <polyline
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    points={data.technical.macdSeries.map((v, i, arr) => typeof v === 'number' ? `${(i/(arr.length-1))*80},${36-((v+10)/20)*36}` : '').join(' ')}
                  />
                  {/* Signal line */}
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={1.5}
                    points={data.technical.macdSignalSeries.map((v, i, arr) => typeof v === 'number' ? `${(i/(arr.length-1))*80},${36-((v+10)/20)*36}` : '').join(' ')}
                  />
                </svg>
              )}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Real-Time Orderbook */}
      <motion.div variants={itemVariants} className="mb-6">
        <OrderbookPanel symbol={data.symbol} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="space-y-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full gradient-primary hover:gradient-secondary font-medium transition-all duration-300">
            View Detailed Analysis
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="secondary"
            className="w-full bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium transition-colors"
          >
            Set Alert
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}