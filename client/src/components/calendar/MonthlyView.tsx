import { motion } from 'framer-motion';
import { CalendarDay } from '@/types/market-data';
import { getMonthName } from '@/lib/date-utils';

interface MonthlyViewProps {
  year: number;
  month: number;
  calendarDays: CalendarDay[];
  onDateSelect: (date: string) => void;
  onMonthSelect: (month: number) => void;
  showMetrics: {
    volatility: boolean;
    liquidity: boolean;
    performance: boolean;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const monthVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

export default function MonthlyView({ 
  year, 
  month, 
  calendarDays, 
  onDateSelect, 
  onMonthSelect, 
  showMetrics 
}: MonthlyViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    index: i,
    name: getMonthName(i),
    isActive: i === month,
    hasData: calendarDays.some(day => new Date(day.date).getMonth() === i)
  }));

  const getMonthStats = (monthIndex: number) => {
    const monthDays = calendarDays.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate.getMonth() === monthIndex && day.isCurrentMonth;
    });

    if (monthDays.length === 0) return null;

    const avgVolatility = monthDays.reduce((sum, day) => {
      const vol = day.volatilityLevel === 'high' ? 3 : day.volatilityLevel === 'medium' ? 2 : 1;
      return sum + vol;
    }, 0) / monthDays.length;

    const avgPerformance = monthDays.reduce((sum, day) => sum + (day.performance || 0), 0) / monthDays.length;
    
    const totalVolume = monthDays.reduce((sum, day) => sum + (day.volume || 0), 0);

    return {
      avgVolatility,
      avgPerformance,
      totalVolume,
      tradingDays: monthDays.length
    };
  };

  const getVolatilityColor = (level: number) => {
    if (level >= 2.5) return 'bg-red-500';
    if (level >= 1.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPerformanceColor = (performance: number) => {
    if (performance > 2) return 'text-green-400';
    if (performance < -2) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-4"
    >
      {months.map((monthData) => {
        const stats = getMonthStats(monthData.index);
        
        return (
          <motion.div
            key={monthData.index}
            variants={monthVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMonthSelect(monthData.index)}
            className={`
              relative p-4 rounded-xl border cursor-pointer transition-all duration-300
              ${monthData.isActive 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 shadow-lg' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
              }
            `}
          >
            {/* Month Header */}
            <div className="text-center mb-3">
              <h3 className={`font-semibold ${monthData.isActive ? 'text-white' : 'text-gray-200'}`}>
                {monthData.name}
              </h3>
              <div className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                {year}
              </div>
            </div>

            {/* Month Statistics */}
            {stats && (
              <div className="space-y-2">
                {showMetrics.volatility && (
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                      Volatility
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getVolatilityColor(stats.avgVolatility)}`} />
                  </div>
                )}

                {showMetrics.performance && (
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                      Performance
                    </span>
                    <span className={`text-xs font-medium ${
                      monthData.isActive ? 'text-white' : getPerformanceColor(stats.avgPerformance)
                    }`}>
                      {stats.avgPerformance > 0 ? '+' : ''}{stats.avgPerformance.toFixed(1)}%
                    </span>
                  </div>
                )}

                {showMetrics.liquidity && (
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                      Volume
                    </span>
                    <span className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                      ${(stats.totalVolume / 1e9).toFixed(1)}B
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-600">
                  <span className={`text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {stats.tradingDays} trading days
                  </span>
                </div>
              </div>
            )}

            {!stats && (
              <div className={`text-center text-xs ${monthData.isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                No data available
              </div>
            )}

            {/* Active Indicator */}
            {monthData.isActive && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}