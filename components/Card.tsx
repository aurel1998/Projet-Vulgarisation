import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <motion.div
      className={`bg-background-secondary border border-border rounded-xl p-6 ${className}`}
      whileHover={hover ? { y: -4, borderColor: "rgb(6, 182, 212)" } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}



