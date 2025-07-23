import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ViewPeriod, CryptoPair } from '@/types/market-data';

interface ControlPanelProps {
  selectedSymbol: CryptoPair;
  showMetrics: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
  onSymbolChange: (symbol: CryptoPair) => void;
  onMetricToggle: (metric: 'volatility' | 'liquidity' | 'performance') => void;
  selectedDateRange: { start: string | null; end: string | null };
  onDateRangeChange: (range: { start: string | null; end: string | null }) => void;
  isRangeSelection: boolean;
  onToggleRangeSelection: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

export default function ControlPanel({
  selectedSymbol,
  showMetrics,
  onSymbolChange,
  onMetricToggle,
  selectedDateRange,
  onDateRangeChange,
  isRangeSelection,
  onToggleRangeSelection,
}: ControlPanelProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {/* Instrument Selector */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <Label className="block text-sm font-medium text-gray-300 mb-2">Financial Instrument</Label>
        <Select value={selectedSymbol} onValueChange={(value: CryptoPair) => onSymbolChange(value)}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
            <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
            <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
            <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Metric Toggle */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <Label className="block text-sm font-medium text-gray-300 mb-2">Display Metrics</Label>
        <div className="space-y-2">
          {Object.entries(showMetrics).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={value}
                onCheckedChange={() => onMetricToggle(key as 'volatility' | 'liquidity' | 'performance')}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label
                htmlFor={key}
                className="text-sm text-gray-300 capitalize cursor-pointer"
              >
                {key}
              </Label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Date Range Selection */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <Label className="block text-sm font-medium text-gray-300">Date Range</Label>
          <button
            type="button"
            className={`text-xs px-2 py-1 rounded ${isRangeSelection ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}
            onClick={onToggleRangeSelection}
          >
            {isRangeSelection ? 'Range' : 'Single'}
          </button>
        </div>
        <div className="flex space-x-2">
          <Input
            type="date"
            value={selectedDateRange.start || ''}
            onChange={e => onDateRangeChange({ start: e.target.value, end: selectedDateRange.end })}
            className="w-full bg-slate-700 border-slate-600 text-white"
          />
          {isRangeSelection && (
            <Input
              type="date"
              value={selectedDateRange.end || ''}
              onChange={e => onDateRangeChange({ start: selectedDateRange.start, end: e.target.value })}
              className="w-full bg-slate-700 border-slate-600 text-white"
            />
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {isRangeSelection
            ? `From: ${selectedDateRange.start || '---'} To: ${selectedDateRange.end || '---'}`
            : `Selected: ${selectedDateRange.start || '---'}`}
        </div>
      </motion.div>
    </motion.div>
  );
}