import { motion } from 'framer-motion';
import { Calendar, Grid3X3, BarChart3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarViewType, CALENDAR_VIEWS } from '@/types/calendar-views';
import { useState } from 'react';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const CurrentIcon = VIEW_ICONS[currentView];

  return (
    <>
      {/* Desktop View - Horizontal buttons */}
      <motion.div 
        className="hidden md:flex items-center space-x-2 bg-slate-700 rounded-lg p-1"
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

      {/* Tablet View - Vertical buttons */}
      <motion.div 
        className="hidden sm:flex md:hidden flex-col space-y-2 bg-slate-700 rounded-lg p-1"
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
                  flex items-center space-x-2 transition-all duration-300 w-full justify-start
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

      {/* Mobile View - Dropdown with icons only */}
      <motion.div 
        className="relative sm:hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg min-w-0 px-2"
        >
          <CurrentIcon className="w-4 h-4 flex-shrink-0" />
          <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isDropdownOpen && (
          <motion.div
            className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {views.map((view) => {
              const Icon = VIEW_ICONS[view];
              const isActive = currentView === view;
              
              return (
                <motion.div key={view} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onViewChange(view);
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      flex items-center justify-center transition-all duration-300 w-10 h-10 rounded-none first:rounded-t-lg last:rounded-b-lg p-0
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-slate-600'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}