import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipCustomProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TooltipCustom({ content, children, className = "" }: TooltipCustomProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.pageX + 10, y: e.pageY - 10 });
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={className}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="tooltip-custom fixed z-50 px-3 py-2 rounded-lg text-sm text-white pointer-events-none max-w-xs"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
