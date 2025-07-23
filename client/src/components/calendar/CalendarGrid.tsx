import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarDay } from '@/types/market-data';
import { getMonthName } from '@/lib/date-utils';
import CalendarCell from './CalendarCell';

interface CalendarGridProps {
  year: number;
  month: number;
  calendarDays: CalendarDay[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: string) => void;
  showMetrics: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
  selectedDate?: string;
  selectedDateRange?: { start: string | null; end: string | null };
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1
    }
  }
};

export default function CalendarGrid({
  year,
  month,
  calendarDays,
  onNavigateMonth,
  onDateSelect,
  showMetrics,
  selectedDate,
  selectedDateRange,
}: CalendarGridProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Calendar Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateMonth('prev')}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-300" />
            </Button>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-white"
            key={`${month}-${year}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getMonthName(month)} {year}
          </motion.h2>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateMonth('next')}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Button>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-3 h-3 volatility-low rounded"></div>
            <span className="text-gray-400">Low Vol</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-3 h-3 volatility-medium rounded"></div>
            <span className="text-gray-400">Med Vol</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-3 h-3 volatility-high rounded"></div>
            <span className="text-gray-400">High Vol</span>
          </div>
        </div>
      </motion.div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-7 gap-1"
      >
        {calendarDays.map((day, index) => (
          <CalendarCell
            key={`${day.date}-${index}`}
            day={day}
            onDateSelect={onDateSelect}
            index={index}
            showMetrics={showMetrics}
            isSelected={day.date === selectedDate}
            selectedDateRange={selectedDateRange}
          />
        ))}
      </motion.div>
    </div>
  );
}
