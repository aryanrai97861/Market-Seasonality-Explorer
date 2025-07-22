import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCalendarState } from '@/hooks/use-calendar-state';
import { useMarketData, useDetailPanelData, useQuickStats } from '@/hooks/use-market-data';
import { binanceAPI } from '@/lib/binance-api';
import AppHeader from '@/components/layout/AppHeader';
import ControlPanel from '@/components/calendar/ControlPanel';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import DetailPanel from '@/components/calendar/DetailPanel';
import QuickStats from '@/components/calendar/QuickStats';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export default function MarketCalendar() {
  const {
    currentDate,
    selectedDate,
    viewPeriod,
    selectedSymbol,
    showMetrics,
    calendarDays,
    year,
    month,
    navigateMonth,
    selectDate,
    setViewPeriod,
    setSelectedSymbol,
    toggleMetric,
  } = useCalendarState();

  const { data: marketData, isLoading: isMarketDataLoading, error: marketDataError } = useMarketData(selectedSymbol);
  const detailPanelData = useDetailPanelData(selectedSymbol, selectedDate);
  const quickStatsData = useQuickStats(selectedSymbol);
  const { toast } = useToast();

  // Update calendar days with market data
  useEffect(() => {
    if (marketData && calendarDays.length > 0) {
      calendarDays.forEach(day => {
        if (day.isCurrentMonth) {
          const dayData = marketData.find(d => d.date === day.date);
          if (dayData) {
            day.marketData = dayData;
            day.volatilityLevel = binanceAPI.calculateVolatilityLevel(dayData.volatility || 0);
            day.performance = dayData.priceChangePercent;
            day.volume = dayData.liquidity || 0;
          }
        }
      });
    }
  }, [marketData, calendarDays]);

  // Handle errors
  useEffect(() => {
    if (marketDataError) {
      toast({
        title: "Error loading market data",
        description: "Failed to fetch cryptocurrency data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [marketDataError, toast]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateMonth('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateMonth('next');
          break;
        case 'Escape':
          e.preventDefault();
          selectDate('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateMonth, selectDate]);

  if (isMarketDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <AppHeader />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-white text-lg">Loading market data...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching real-time cryptocurrency information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-dark"
    >
      <AppHeader />
      
      <div className="container mx-auto p-6 space-y-6">
        <ControlPanel
          selectedSymbol={selectedSymbol}
          viewPeriod={viewPeriod}
          showMetrics={showMetrics}
          onSymbolChange={setSelectedSymbol}
          onViewPeriodChange={setViewPeriod}
          onMetricToggle={toggleMetric}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <CalendarGrid
              year={year}
              month={month}
              calendarDays={calendarDays}
              onNavigateMonth={navigateMonth}
              onDateSelect={selectDate}
            />
          </div>
          
          <div className="xl:col-span-1">
            <DetailPanel data={detailPanelData} />
          </div>
        </div>

        <QuickStats data={quickStatsData} isLoading={isMarketDataLoading} />
      </div>
    </motion.div>
  );
}
