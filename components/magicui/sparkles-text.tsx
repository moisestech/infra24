"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: string[];
}

export function SparklesText({
  text,
  className,
  sparklesCount = 20,
  colors = ["#FFD700", "#FFA500", "#FF69B4", "#00BFFF", "#32CD32"],
}: SparklesTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.className = "absolute pointer-events-none";
      
      const size = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = color;
      sparkle.style.borderRadius = "50%";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animation = `sparkle 2s ease-in-out infinite`;
      sparkle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 2000);
    };

    const interval = setInterval(createSparkle, 100);
    
    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
    </div>
  );
}

