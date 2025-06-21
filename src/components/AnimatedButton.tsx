"use client";

import { motion } from "framer-motion";
import { ReactNode, MouseEvent } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "primary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
}: AnimatedButtonProps) {
  const baseStyles =
    "relative font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-30 transform-gpu";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(91,63,249,0.5)] focus:ring-[var(--primary)] border border-white/10",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.5)] focus:ring-red-500 border border-white/10",
  };

  const disabledStyles = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className} rounded-full overflow-hidden`}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : undefined}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={
          !disabled
            ? {
                scale: 2,
                opacity: 0,
                transition: { duration: 0.4 },
              }
            : undefined
        }
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 -z-10 rounded-full opacity-0"
        style={{
          background:
            variant === "primary"
              ? "var(--gradient-primary)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          filter: "blur(20px)",
        }}
        whileHover={!disabled ? { opacity: 0.6 } : undefined}
        transition={{ duration: 0.3 }}
      />

      {/* Inner shadow for depth */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </motion.button>
  );
}
