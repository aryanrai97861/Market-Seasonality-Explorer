import { motion } from 'framer-motion';
import { TrendingUp, Activity, Droplets, AlertTriangle } from 'lucide-react';
import { QuickStatsData } from '@/types/market-data';
import { formatVolume, formatPercentage } from '@/lib/date-utils';

interface QuickStatsProps {
  data: QuickStatsData | null;
  isLoading?: boolean;
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 200 }
  }
};

export default function QuickStats({ data, isLoading }: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="loading-shimmer w-full h-4 bg-slate-700 rounded mb-4"></div>
            <div className="loading-shimmer w-20 h-8 bg-slate-700 rounded mb-2"></div>
            <div className="loading-shimmer w-24 h-4 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Avg Monthly Volatility',
      value: `${data.avgVolatility.toFixed(2)}%`,
      change: '+0.3% from last month',
      changePositive: true,
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      title: 'Total Volume',
      value: formatVolume(data.totalVolume),
      change: '-5.2% from last month',
      changePositive: false,
      icon: Droplets,
      color: 'text-blue-400'
    },
    {
      title: 'Monthly Performance',
      value: formatPercentage(data.monthlyPerformance),
      change: 'Positive trend',
      changePositive: data.monthlyPerformance > 0,
      icon: TrendingUp,
      color: data.monthlyPerformance > 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      title: 'High Vol Days',
      value: data.highVolDays.toString(),
      change: 'Above average',
      changePositive: false,
      icon: AlertTriangle,
      color: 'text-yellow-400'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-gray-400 text-sm font-medium">{stat.title}</h4>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <motion.div 
              className={`text-2xl font-bold text-white mb-1`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {stat.value}
            </motion.div>
            <div className={`text-sm ${
              stat.changePositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
