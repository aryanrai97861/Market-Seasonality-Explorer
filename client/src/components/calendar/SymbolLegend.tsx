import { motion } from 'framer-motion';
import { Circle, Zap, Activity, TrendingUp, ArrowDown, Droplets, Info } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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

export default function SymbolLegend() {
  const symbols = [
    {
      category: 'Volatility Indicators',
      items: [
        { symbol: <Circle className="w-3 h-3 text-green-400 fill-current" />, label: 'Low Volatility (<2%)', description: 'Stable price movement' },
        { symbol: <Zap className="w-3 h-3 text-yellow-400" />, label: 'Medium Volatility (2-5%)', description: 'Moderate price swings' },
        { symbol: <Activity className="w-3 h-3 text-red-400" />, label: 'High Volatility (>5%)', description: 'Significant price movement' }
      ]
    },
    {
      category: 'Performance Indicators',
      items: [
        { symbol: <TrendingUp className="w-3 h-3 text-green-400" />, label: 'Strong Positive (>2%)', description: 'Significant price increase' },
        { symbol: <ArrowDown className="w-3 h-3 text-red-400" />, label: 'Strong Negative (<-2%)', description: 'Significant price decrease' },
        { symbol: <div className="w-2 h-2 bg-gray-400 rounded-full" />, label: 'Neutral (-2% to 2%)', description: 'Minor price change' }
      ]
    },
    {
      category: 'Liquidity Indicators',
      items: [
        { 
          symbol: <div className="flex space-x-0.5"><div className="w-1 h-1 bg-blue-400 rounded-full" /></div>, 
          label: 'Low Volume', 
          description: '<$100M trading volume' 
        },
        { 
          symbol: <div className="flex space-x-0.5"><div className="w-1 h-1 bg-blue-400 rounded-full" /><div className="w-1 h-1 bg-blue-400 rounded-full" /></div>, 
          label: 'Medium Volume', 
          description: '$100M-$1B trading volume' 
        },
        { 
          symbol: <div className="flex space-x-0.5"><div className="w-1 h-1 bg-blue-400 rounded-full" /><div className="w-1 h-1 bg-blue-400 rounded-full" /><div className="w-1 h-1 bg-blue-400 rounded-full" /></div>, 
          label: 'High Volume', 
          description: '>$1B trading volume' 
        }
      ]
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <motion.div variants={itemVariants} className="flex items-center space-x-2 mb-4">
        <Info className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Symbol Legend</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {symbols.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            variants={itemVariants}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-300 border-b border-slate-600 pb-2">
              {category.category}
            </h4>
            
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                    {item.symbol}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        variants={itemVariants}
        className="mt-6 pt-4 border-t border-slate-600"
      >
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>💡 Tip: Use arrow keys to navigate between dates</span>
          <span>Ctrl/Cmd + arrows for month navigation</span>
        </div>
      </motion.div>
    </motion.div>
  );
}