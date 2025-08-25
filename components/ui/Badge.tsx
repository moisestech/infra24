import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
  type?: 'today' | 'future' | 'past';
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ type, children, className, variant = 'default' }: BadgeProps) {
  // If type is provided, use the original logic
  if (type) {
    return (
      <motion.div 
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          "text-xl font-bold shadow-lg backdrop-blur-sm",
          type === 'today' ? "bg-green-500/90 text-white" : 
          type === 'past' ? "bg-red-500/90 text-white" : 
          "bg-blue-500/90 text-white",
          className
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {children}
      </motion.div>
    );
  }

  // Otherwise use variant-based styling
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
} 