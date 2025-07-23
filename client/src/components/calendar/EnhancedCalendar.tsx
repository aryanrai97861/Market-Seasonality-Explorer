import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarDay } from '@/types/market-data';
import { CalendarViewType } from '@/types/calendar-views';
import { getMonthName } from '@/lib/date-utils';
import ViewSelector from './ViewSelector';
import CalendarGrid from './CalendarGrid';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';

interface EnhancedCalendarProps {
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
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, delay: 0.1 }
  }
};

export default function EnhancedCalendar({
  year,
  month,
  calendarDays,
  onNavigateMonth,
  onDateSelect,
  showMetrics,
  selectedDate,
  currentView,
  onViewChange
}: EnhancedCalendarProps) {
  
  const handleMonthSelect = (newMonth: number) => {
    const currentMonthIndex = new Date().getMonth();
    const direction = newMonth > currentMonthIndex ? 'next' : 'prev';
    const monthDiff = Math.abs(newMonth - currentMonthIndex);
    
    // Navigate to the selected month
    for (let i = 0; i < monthDiff; i++) {
      onNavigateMonth(direction);
    }
    
    // Switch back to daily view when a month is selected
    onViewChange('daily');
  };

  const renderCalendarContent = () => {
    switch (currentView) {
      case 'daily':
        return (
          <CalendarGrid
            year={year}
            month={month}
            calendarDays={calendarDays}
            onNavigateMonth={onNavigateMonth}
            onDateSelect={onDateSelect}
            showMetrics={showMetrics}
            selectedDate={selectedDate}
          />
        );
      
      case 'weekly':
        return (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <WeeklyView
              calendarDays={calendarDays}
              onDateSelect={onDateSelect}
              showMetrics={showMetrics}
              selectedDate={selectedDate}
            />
          </div>
        );
      
      case 'monthly':
        return (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <MonthlyView
              year={year}
              month={month}
              calendarDays={calendarDays}
              onDateSelect={onDateSelect}
              onMonthSelect={handleMonthSelect}
              showMetrics={showMetrics}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        {/* Navigation Controls - Only show for daily view */}
        {currentView === 'daily' && (
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
              className="text-2xl font-bold text-white min-w-[200px]"
              key={`${year}-${month}`}
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
        )}

        {/* View Title for non-daily views */}
        {currentView !== 'daily' && (
          <motion.h2 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'weekly' ? `${getMonthName(month)} ${year} - Weekly View` : 
             currentView === 'monthly' ? `${year} - Monthly Overview` : ''}
          </motion.h2>
        )}

        {/* View Selector */}
        <ViewSelector 
          currentView={currentView} 
          onViewChange={onViewChange} 
        />
      </motion.div>

      {/* Calendar Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        key={currentView}
      >
        {renderCalendarContent()}
      </motion.div>

      {/* View Description */}
      <motion.div
        className="text-center text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentView === 'daily' && 'Daily view shows individual dates with detailed market indicators'}
        {currentView === 'weekly' && 'Weekly view organizes dates by weeks for pattern analysis'}
        {currentView === 'monthly' && 'Monthly view provides aggregated statistics for each month'}
      </motion.div>
    </div>
  );
}