import { motion } from 'framer-motion';
import { Calendar, Grid3X3, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarViewType, CALENDAR_VIEWS } from '@/types/calendar-views';

interface ViewSelectorProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

const VIEW_ICONS = {
  daily: Calendar,
  weekly: BarChart3,
  monthly: Grid3X3
};

export default function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views: CalendarViewType[] = ['daily', 'weekly', 'monthly'];

  return (
    <motion.div 
      className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {views.map((view) => {
        const Icon = VIEW_ICONS[view];
        const isActive = currentView === view;
        
        return (
          <motion.div key={view} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view)}
              className={`
                flex items-center space-x-2 transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-600'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {CALENDAR_VIEWS[view].title.replace(' View', '')}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}