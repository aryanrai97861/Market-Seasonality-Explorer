import { motion } from 'framer-motion';
import { ChartLine, Download, User, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportMenu from './ExportMenu';
import { CalendarDay } from '@/types/market-data';
import { useState, useRef } from 'react';

interface AppHeaderProps {
  isConnected?: boolean;
  currentSymbol?: string;
  calendarDays: CalendarDay[];
}

export default function AppHeader({ isConnected = false, currentSymbol = 'BTCUSDT', calendarDays }: AppHeaderProps) {
  const [showExport, setShowExport] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="gradient-primary p-3 sm:p-4 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90"
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2 sm:space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-secondary rounded-lg flex items-center justify-center">
            <ChartLine className="text-white text-base sm:text-lg" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white hidden xs:block">
            Market Seasonality Explorer
          </h1>
          <h1 className="text-lg font-bold text-white block xs:hidden">
            MSE
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Connection Status */}
          <motion.div 
            className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 rounded-lg px-2 py-1 sm:px-3 sm:py-1"
            whileHover={{ scale: 1.02 }}
          >
            {isConnected ? (
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            )}
            <span className="text-white text-xs sm:text-sm">
              <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'} • </span>
              <span className="sm:hidden">{isConnected ? 'L' : 'X'} • </span>
              <span className="hidden md:inline">{currentSymbol.replace('USDT', '/USDT')}</span>
              <span className="md:hidden">{currentSymbol.replace('USDT', '')}</span>
            </span>
          </motion.div>

          {/* Export Dropdown */}
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <Button
                variant="ghost"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2"
                onClick={() => setShowExport(v => !v)}
                aria-haspopup="menu"
                aria-expanded={showExport}
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Export</span>
              </Button>
              {showExport && (
                <div className="absolute right-0 mt-2 z-50" onMouseLeave={() => setShowExport(false)}>
                  <ExportMenu calendarDays={calendarDays} />
                </div>
              )}
            </motion.div>
            {/* Mobile Export Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="block sm:hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 p-2"
                onClick={() => setShowExport(v => !v)}
                aria-haspopup="menu"
                aria-expanded={showExport}
              >
                <Download className="w-4 h-4" />
              </Button>
              {showExport && (
                <div className="absolute right-0 mt-2 z-50" onMouseLeave={() => setShowExport(false)}>
                  <ExportMenu calendarDays={calendarDays} />
                </div>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-7 h-7 sm:w-8 sm:h-8 gradient-secondary rounded-full flex items-center justify-center cursor-pointer"
          >
            <User className="text-white text-xs sm:text-sm" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}