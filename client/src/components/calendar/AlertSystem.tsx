
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, X } from 'lucide-react';
import { CalendarDay } from '@/types/market-data';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  type: 'volatility' | 'performance';
  level: 'high' | 'low';
  message: string;
  date: string;
  timestamp: Date;
}

interface AlertSystemProps {
  calendarDays: CalendarDay[];
  symbol: string;
}

export default function AlertSystem({ calendarDays, symbol }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    highVolatility: true,
    extremePerformance: true,
    performanceThreshold: 5,
    maxAlerts: 5
  });

  useEffect(() => {
    const newAlerts: Alert[] = [];
    
    calendarDays.forEach(day => {
      if (!day.isCurrentMonth) return;
      
      // High volatility alert
      if (alertSettings.highVolatility && day.volatilityLevel === 'high') {
        newAlerts.push({
          id: `vol-${day.date}`,
          type: 'volatility',
          level: 'high',
          message: `High volatility detected on ${day.date}`,
          date: day.date,
          timestamp: new Date()
        });
      }
      
      // Extreme performance alert
      if (alertSettings.extremePerformance && Math.abs(day.performance) > alertSettings.performanceThreshold) {
        newAlerts.push({
          id: `perf-${day.date}`,
          type: 'performance',
          level: day.performance > 0 ? 'high' : 'low',
          message: `${day.performance > 0 ? 'Strong gain' : 'Significant loss'} of ${day.performance.toFixed(2)}% on ${day.date}`,
          date: day.date,
          timestamp: new Date()
        });
      }
    });
    
    // Keep only recent alerts and limit count
    const recentAlerts = newAlerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, alertSettings.maxAlerts);
    
    setAlerts(recentAlerts);
  }, [calendarDays, alertSettings, symbol]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (alert: Alert) => {
    if (alert.type === 'volatility') return <AlertTriangle className="w-4 h-4" />;
    return alert.level === 'high' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getAlertColor = (alert: Alert) => {
    if (alert.type === 'volatility') return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    return alert.level === 'high' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10';
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className={`border rounded-lg p-3 backdrop-blur-sm ${getAlertColor(alert)}`}
          >
            <div className="flex items-start justify-between space-x-3">
              <div className="flex items-center space-x-2 flex-1">
                {getAlertIcon(alert)}
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissAlert(alert.id)}
                className="h-6 w-6 p-0 hover:bg-white/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
