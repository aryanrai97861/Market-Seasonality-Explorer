import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCalendarState } from '@/hooks/use-calendar-state';
import { useMarketData, useDetailPanelData, useQuickStats } from '@/hooks/use-market-data';
import { useBinanceWebSocket } from '@/hooks/use-binance-websocket';
import { binanceAPI } from '@/lib/binance-api';
import AppHeader from '@/components/layout/AppHeader';
import ControlPanel from '@/components/calendar/ControlPanel';
import EnhancedCalendar from '@/components/calendar/EnhancedCalendar';
import DetailPanel from '@/components/calendar/DetailPanel';
import QuickStats from '@/components/calendar/QuickStats';
import SymbolLegend from '@/components/calendar/SymbolLegend';
import OrderbookPanel from '@/components/calendar/OrderbookPanel';
import { CalendarViewType } from '@/types/calendar-views';
import ComparisonTool from '@/components/calendar/ComparisonTool';

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
    selectedDate,
    selectedDateRange,
    isRangeSelection,
    selectedSymbol,
    showMetrics,
    calendarDays,
    year,
    month,
    navigateMonth,
    selectDate,
    setSelectedSymbol,
    toggleMetric,
    toggleRangeSelection,
  } = useCalendarState();

  const [currentView, setCurrentView] = useState<CalendarViewType>('daily');

  const { data: marketData, isLoading: isMarketDataLoading, error: marketDataError } = useMarketData(selectedSymbol);
  const detailPanelData = useDetailPanelData(selectedSymbol, selectedDate);
  const quickStatsData = useQuickStats(selectedSymbol);
  const { toast } = useToast();

  // WebSocket connection for real-time data
  const { isConnected } = useBinanceWebSocket(selectedSymbol, true);

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

  // Add handler for date range change
  const handleDateRangeChange = (range: { start: string | null; end: string | null }) => {
    // Use selectDate for single, or update selectedDateRange for range
    if (!isRangeSelection) {
      selectDate(range.start || '');
    } else {
      // This will update selectedDateRange in the hook
      // (selectDate already handles range logic, but you can call it here for clarity)
      if (range.start && range.end) {
        selectDate(range.end); // selectDate will update the range
      } else if (range.start) {
        selectDate(range.start);
      }
    }
  };

  // Range summary calculation
  function getRangeSummary() {
    if (!selectedDateRange.start || !selectedDateRange.end) return null;
    const start = new Date(selectedDateRange.start);
    const end = new Date(selectedDateRange.end);
    const daysInRange = calendarDays.filter(day => {
      const date = new Date(day.date);
      return date >= start && date <= end && day.isCurrentMonth;
    });
    if (daysInRange.length === 0) return null;
    const avgVolatility = daysInRange.reduce((sum, d) => sum + (d.marketData?.volatility || 0), 0) / daysInRange.length;
    const totalVolume = daysInRange.reduce((sum, d) => sum + (d.marketData?.liquidity || 0), 0);
    const avgPerformance = daysInRange.reduce((sum, d) => sum + (d.marketData?.priceChangePercent || 0), 0) / daysInRange.length;
    return { avgVolatility, totalVolume, avgPerformance, count: daysInRange.length };
  }
  const rangeSummary = getRangeSummary();

  if (isMarketDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <AppHeader isConnected={isConnected} currentSymbol={selectedSymbol} calendarDays={calendarDays} />
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
      <AppHeader isConnected={isConnected} currentSymbol={selectedSymbol} calendarDays={calendarDays} />

      <div className="container mx-auto p-6 space-y-6">
        <ControlPanel
          selectedSymbol={selectedSymbol}
          showMetrics={showMetrics}
          onSymbolChange={setSelectedSymbol}
          onMetricToggle={toggleMetric}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={handleDateRangeChange}
          isRangeSelection={isRangeSelection}
          onToggleRangeSelection={toggleRangeSelection}
        />

        {/* Range summary */}
        {rangeSummary && (
          <div className="mb-4 p-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-4 text-white">
            <div>Range: {selectedDateRange.start} to {selectedDateRange.end} ({rangeSummary.count} days)</div>
            <div>Avg Volatility: {rangeSummary.avgVolatility.toFixed(2)}%</div>
            <div>Total Volume: {rangeSummary.totalVolume.toLocaleString()}</div>
            <div>Avg Performance: {rangeSummary.avgPerformance.toFixed(2)}%</div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3" id="calendar-export-root">
            <EnhancedCalendar
              year={year}
              month={month}
              calendarDays={calendarDays}
              onNavigateMonth={navigateMonth}
              onDateSelect={selectDate}
              showMetrics={showMetrics}
              selectedDate={selectedDate || undefined}
              currentView={currentView}
              onViewChange={setCurrentView}
              selectedDateRange={selectedDateRange}
            />

            <div className="mt-6">
              <ComparisonTool
                currentSymbol={selectedSymbol}
                calendarDays={calendarDays}
                onSymbolCompare={setSelectedSymbol}
              />
            </div>
          </div>

          <div className="xl:col-span-1">
            <DetailPanel data={detailPanelData} />
          </div>
        </div>

        <QuickStats data={quickStatsData} isLoading={isMarketDataLoading} />

        {/* Real-Time Orderbook Panel */}
        <OrderbookPanel symbol={selectedSymbol} />

        <SymbolLegend />
      </div>
    </motion.div>
  );
}