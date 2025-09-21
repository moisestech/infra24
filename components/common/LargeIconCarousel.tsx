'use client';

import React from 'react';
import { motion, AnimatePresence, easeIn, easeOut } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IconItem {
  icon: LucideIcon;
  label: string;
}

interface LargeIconCarouselProps {
  icons: IconItem[];
  reducedMotion?: boolean;
}

const iconVariants = {
  enter: { 
    scale: 0.8,
    opacity: 0,
    y: 20
  },
  center: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  },
  exit: { 
    scale: 0.8,
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
      ease: easeIn
    }
  }
};

const titleVariants = {
  enter: { opacity: 0, y: 20 },
  center: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2
    }
  },
  exit: { opacity: 0, y: -20 }
};

export default function LargeIconCarousel({ icons, reducedMotion = false }: LargeIconCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [icons.length]);

  if (reducedMotion) {
    const currentIcon = icons[0];
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          {React.createElement(currentIcon.icon, {
            className: "w-64 h-64 md:w-96 md:h-96 mx-auto text-yellow-400",
            style: { 
              filter: "drop-shadow(0 0 30px rgba(234, 179, 8, 0.4))"
            }
          })}
          <h3 className="text-2xl font-bold mt-8 text-yellow-200">{currentIcon.label}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="text-center"
          initial="enter"
          animate="center"
          exit="exit"
          variants={iconVariants}
        >
          <motion.div
            className="w-64 h-64 md:w-96 md:h-96 mx-auto"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {React.createElement(icons[currentIndex].icon, {
              className: "w-full h-full text-yellow-400",
              style: { 
                filter: "drop-shadow(0 0 30px rgba(234, 179, 8, 0.4))"
              }
            })}
          </motion.div>
          <motion.h3
            className="text-2xl font-bold mt-8 text-yellow-200"
            variants={titleVariants}
          >
            {icons[currentIndex].label}
          </motion.h3>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

