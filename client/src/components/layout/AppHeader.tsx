import { motion } from 'framer-motion';
import { ChartLine, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="gradient-primary p-4 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90"
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center">
            <ChartLine className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Market Seasonality Explorer</h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center cursor-pointer"
          >
            <User className="text-white text-sm" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
