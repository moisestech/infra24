'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevTextSizeControlsProps {
  onTextSizeChange: (multiplier: number) => void;
  className?: string;
}

export function DevTextSizeControls({ onTextSizeChange, className }: DevTextSizeControlsProps) {
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);

  const handleSizeChange = (newMultiplier: number) => {
    setTextSizeMultiplier(newMultiplier);
    onTextSizeChange(newMultiplier);
  };

  const increaseSize = () => {
    const newSize = Math.min(textSizeMultiplier + 0.1, 2.0);
    handleSizeChange(newSize);
  };

  const decreaseSize = () => {
    const newSize = Math.max(textSizeMultiplier - 0.1, 0.5);
    handleSizeChange(newSize);
  };

  const resetSize = () => {
    handleSizeChange(1.0);
  };

  return (
    <motion.div 
      className={cn(
        "fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-white text-sm font-medium mb-2">
          Dev Controls - Text Size
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={decreaseSize}
            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Minus className="w-4 h-4 text-white" />
          </motion.button>
          
          <div className="text-white text-sm font-mono min-w-[60px] text-center">
            {(textSizeMultiplier * 100).toFixed(0)}%
          </div>
          
          <motion.button
            onClick={increaseSize}
            className="p-2 bg-green-500/80 hover:bg-green-500 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        
        <motion.button
          onClick={resetSize}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-md transition-colors text-white text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
}
