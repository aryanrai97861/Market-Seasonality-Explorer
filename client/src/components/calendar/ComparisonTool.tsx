
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { CalendarDay, CryptoPair } from '@/types/market-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPercentage } from '@/lib/date-utils';

interface ComparisonToolProps {
  currentSymbol: CryptoPair;
  calendarDays: CalendarDay[];
  onSymbolCompare: (symbol: CryptoPair) => void;
}

interface ComparisonMetrics {
  symbol: CryptoPair;
  avgVolatility: number;
  avgPerformance: number;
  totalVolume: number;
  highVolDays: number;
}

export default function ComparisonTool({ currentSymbol, calendarDays, onSymbolCompare }: ComparisonToolProps) {
  const [compareSymbol, setCompareSymbol] = useState<CryptoPair>('ETHUSDT');
  const [isComparing, setIsComparing] = useState(false);

  const calculateMetrics = (symbol: CryptoPair): ComparisonMetrics => {
    const currentMonthDays = calendarDays.filter(day => day.isCurrentMonth);
    
    return {
      symbol,
      avgVolatility: currentMonthDays.reduce((sum, day) => {
        const vol = day.volatilityLevel === 'high' ? 3 : day.volatilityLevel === 'medium' ? 2 : 1;
        return sum + vol;
      }, 0) / currentMonthDays.length,
      avgPerformance: currentMonthDays.reduce((sum, day) => sum + day.performance, 0) / currentMonthDays.length,
      totalVolume: currentMonthDays.reduce((sum, day) => sum + day.volume, 0),
      highVolDays: currentMonthDays.filter(day => day.volatilityLevel === 'high').length
    };
  };

  const currentMetrics = calculateMetrics(currentSymbol);
  const compareMetrics = calculateMetrics(compareSymbol);

  const symbols: CryptoPair[] = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Symbol Comparison</h3>
        </div>
        <Button
          onClick={() => setIsComparing(!isComparing)}
          variant={isComparing ? "default" : "outline"}
          size="sm"
        >
          {isComparing ? 'Hide' : 'Compare'}
        </Button>
      </div>

      {isComparing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Compare with:
            </label>
            <Select value={compareSymbol} onValueChange={(value: CryptoPair) => setCompareSymbol(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {symbols.filter(s => s !== currentSymbol).map(symbol => (
                  <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-600">
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Current Symbol */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">{currentMetrics.symbol}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Volatility:</span>
                  <span className="text-white">{currentMetrics.avgVolatility.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Performance:</span>
                  <span className={currentMetrics.avgPerformance >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(currentMetrics.avgPerformance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High Vol Days:</span>
                  <span className="text-white">{currentMetrics.highVolDays}</span>
                </div>
              </div>
            </div>

            {/* Compare Symbol */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">{compareMetrics.symbol}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Volatility:</span>
                  <span className="text-white">{compareMetrics.avgVolatility.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Performance:</span>
                  <span className={compareMetrics.avgPerformance >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(compareMetrics.avgPerformance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High Vol Days:</span>
                  <span className="text-white">{compareMetrics.highVolDays}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
