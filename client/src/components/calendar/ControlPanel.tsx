import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ViewPeriod, CryptoPair } from '@/types/market-data';

interface ControlPanelProps {
  selectedSymbol: CryptoPair;
  viewPeriod: ViewPeriod;
  showMetrics: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
  onSymbolChange: (symbol: CryptoPair) => void;
  onViewPeriodChange: (period: ViewPeriod) => void;
  onMetricToggle: (metric: 'volatility' | 'liquidity' | 'performance') => void;
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
  viewPeriod,
  showMetrics,
  onSymbolChange,
  onViewPeriodChange,
  onMetricToggle,
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

      {/* Time Period Selector */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <Label className="block text-sm font-medium text-gray-300 mb-2">View Period</Label>
        <div className="flex space-x-1">
          {(['daily', 'weekly', 'monthly'] as ViewPeriod[]).map((period) => (
            <Button
              key={period}
              variant={viewPeriod === period ? "default" : "secondary"}
              size="sm"
              className={`flex-1 text-sm font-medium transition-all duration-300 ${
                viewPeriod === period 
                  ? 'gradient-primary text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
              onClick={() => onViewPeriodChange(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
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

      {/* Date Range */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <Label className="block text-sm font-medium text-gray-300 mb-2">Date Range</Label>
        <Input
          type="month"
          defaultValue="2024-01"
          className="w-full bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </motion.div>
    </motion.div>
  );
}
