import { motion } from 'framer-motion';
import { CalendarDay } from '@/types/market-data';
import CalendarCell from './CalendarCell';

interface WeeklyViewProps {
  calendarDays: CalendarDay[];
  onDateSelect: (date: string) => void;
  showMetrics: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
  selectedDate?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const weekVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export default function WeeklyView({ calendarDays, onDateSelect, showMetrics, selectedDate }: WeeklyViewProps) {
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Week Labels */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Weekly Grid */}
      <div className="space-y-3">
        {weeks.map((week, weekIndex) => (
          <motion.div
            key={weekIndex}
            variants={weekVariants}
            className="grid grid-cols-7 gap-2"
          >
            {week.map((day, dayIndex) => (
              <div key={day.date} className="aspect-square">
                <CalendarCell
                  day={day}
                  onDateSelect={onDateSelect}
                  index={weekIndex * 7 + dayIndex}
                  showMetrics={showMetrics}
                  isSelected={selectedDate === day.date}
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}