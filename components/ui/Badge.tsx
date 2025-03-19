import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
  type: 'today' | 'future' | 'past';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ type, children, className }: BadgeProps) {
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