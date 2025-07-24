import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, Activity, Droplets, Zap, Circle } from 'lucide-react';
import { CalendarDay } from '@/types/market-data';
import { TooltipCustom } from '@/components/ui/tooltip-custom';
import { formatPercentage, formatVolume } from '@/lib/date-utils';

interface CalendarCellProps {
  day: CalendarDay;
  onDateSelect: (date: string) => void;
  index: number;
  showMetrics?: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
  isSelected?: boolean;
  selectedDateRange?: { start: string | null; end: string | null };
}

export default function CalendarCell({ day, onDateSelect, index, showMetrics = { volatility: true, liquidity: true, performance: true }, isSelected = false, selectedDateRange }: CalendarCellProps) {
  const getVolatilityClass = () => {
    if (!day.isCurrentMonth) return 'bg-slate-700 bg-opacity-50 text-gray-500';
    
    switch (day.volatilityLevel) {
      case 'low':
        return 'volatility-low text-white';
      case 'medium':
        return 'volatility-medium text-white';
      case 'high':
        return 'volatility-high text-white';
      default:
        return 'bg-slate-700 text-gray-300';
    }
  };

  const getVolatilitySymbol = () => {
    if (!day.isCurrentMonth || !showMetrics?.volatility) return null;
    switch (day.volatilityLevel) {
      case 'low': return <Circle className="w-4 h-4 text-green-400 fill-current" />;
      case 'medium': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'high': return <Activity className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getLiquiditySymbol = () => {
    if (!day.isCurrentMonth || !showMetrics?.liquidity || !day.volume) return null;
    const intensity = day.volume > 1000000000 ? 'high' : day.volume > 100000000 ? 'medium' : 'low';
    const dots = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
    
    return (
      <div className="flex space-x-1">
        {Array.from({ length: dots }).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-blue-400 rounded-full" />
        ))}
      </div>
    );
  };

  const getPerformanceSymbol = () => {
    if (!day.isCurrentMonth || !showMetrics?.performance) return null;
    if (day.performance > 2) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (day.performance < -2) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
  };

  const tooltipContent = day.isCurrentMonth ? (
    <div className="space-y-2">
      <div className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}</div>
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex items-center justify-between">
          <span>Volatility:</span>
          <span className="flex items-center space-x-1">
            {getVolatilitySymbol()}
            <span>{day.volatilityLevel} ({day.marketData?.volatility?.toFixed(2)}%)</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Performance:</span>
          <span className="flex items-center space-x-1">
            {getPerformanceSymbol()}
            <span>{formatPercentage(day.performance)}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Liquidity:</span>
          <span className="flex items-center space-x-1">
            {getLiquiditySymbol()}
            <span>{formatVolume(day.volume)}</span>
          </span>
        </div>
      </div>
    </div>
  ) : null;

  const isInRange = () => {
    if (!selectedDateRange?.start || !selectedDateRange?.end) return false;
    const date = new Date(day.date);
    const start = new Date(selectedDateRange.start);
    const end = new Date(selectedDateRange.end);
    return date >= start && date <= end;
  };

  return (
    <TooltipCustom content={tooltipContent}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.01,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ 
          scale: day.isCurrentMonth ? 1.05 : 1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className={`
          calendar-cell ${getVolatilityClass()} rounded-lg p-2 h-20 text-sm cursor-pointer relative
          ${day.isToday ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}
          ${day.isSelected || isSelected ? 'ring-2 ring-white ring-opacity-50' : ''}
          ${isInRange() ? 'ring-2 ring-cyan-400 ring-opacity-60' : ''}
          ${day.anomalyType === 'anomaly' ? 'ring-4 ring-pink-500 ring-opacity-80 animate-pulse' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        onClick={() => day.isCurrentMonth && onDateSelect(day.date)}
        tabIndex={day.isCurrentMonth ? 0 : -1}
        role="button"
        aria-label={`${day.dayNumber} ${day.isCurrentMonth ? `${day.volatilityLevel} volatility, ${formatPercentage(day.performance)} performance` : ''}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && day.isCurrentMonth) {
            e.preventDefault();
            onDateSelect(day.date);
          }
        }}
      >
        <div className="flex justify-between items-start h-full">
          <span className="relative z-10 font-medium">{day.dayNumber}</span>
          {day.anomalyType === 'anomaly' && (
            <span className="absolute top-1 right-1 z-20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle animate-pulse"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </span>
          )}
          
          {/* Today Indicator */}
          {day.isToday && (
            <div className="w-2 h-2 bg-white rounded-full z-10 animate-pulse" />
          )}
        </div>
        
        {day.isCurrentMonth && (
          <>
            {/* Metric Symbols Row */}
            <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center z-10">
              <div className="flex items-center space-x-1">
                {/* Volatility Symbol */}
                {showMetrics?.volatility && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02 + 0.1 }}
                  >
                    {getVolatilitySymbol()}
                  </motion.div>
                )}
                
                {/* Liquidity Symbol */}
                {showMetrics?.liquidity && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02 + 0.15 }}
                  >
                    {getLiquiditySymbol()}
                  </motion.div>
                )}
              </div>
              
              {/* Performance Symbol */}
              {showMetrics?.performance && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.02 + 0.2 }}
                >
                  {getPerformanceSymbol()}
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </TooltipCustom>
  );
}
