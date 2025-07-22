import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CalendarDay } from '@/types/market-data';
import { TooltipCustom } from '@/components/ui/tooltip-custom';
import { formatPercentage, formatVolume } from '@/lib/date-utils';

interface CalendarCellProps {
  day: CalendarDay;
  onDateSelect: (date: string) => void;
  index: number;
}

export default function CalendarCell({ day, onDateSelect, index }: CalendarCellProps) {
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

  const tooltipContent = day.isCurrentMonth ? (
    <div>
      <div className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}</div>
      <div className="text-xs text-gray-300 space-y-1 mt-1">
        <div>Volatility: {day.volatilityLevel} ({day.marketData?.volatility?.toFixed(2)}%)</div>
        <div>Performance: {formatPercentage(day.performance)}</div>
        <div>Volume: {formatVolume(day.volume)}</div>
      </div>
    </div>
  ) : null;

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
          ${day.isSelected ? 'ring-2 ring-white ring-opacity-50' : ''}
        `}
        onClick={() => day.isCurrentMonth && onDateSelect(day.date)}
      >
        <span className="relative z-10">{day.dayNumber}</span>
        
        {day.isCurrentMonth && (
          <>
            {/* Performance Arrow */}
            <div className="absolute bottom-1 right-1 z-10">
              {day.performance > 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : day.performance < 0 ? (
                <ArrowDown className="w-3 h-3" />
              ) : null}
            </div>
            
            {/* Volume Indicator */}
            <div 
              className="absolute bottom-1 left-1 bg-white bg-opacity-50 rounded z-10"
              style={{ 
                width: `${Math.min(20, Math.max(4, (day.volume / 1000000000) * 20))}px`,
                height: '2px'
              }}
            />

            {/* Today Indicator */}
            {day.isToday && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full z-10" />
            )}
          </>
        )}
      </motion.div>
    </TooltipCustom>
  );
}
