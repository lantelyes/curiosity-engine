"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StatusIndicatorProps {
  status: "idle" | "connecting" | "connected" | "listening" | "speaking";
  text?: string;
}

export default function StatusIndicator({
  status,
  text,
}: StatusIndicatorProps) {
  const statusConfig = {
    idle: { color: "#6b7280", text: "" },
    connecting: { color: "#f59e0b", text: "Connecting..." },
    connected: { color: "#10b981", text: "Connected" },
    listening: { color: "#10b981", text: "Listening..." },
    speaking: { color: "#3b82f6", text: "AI is speaking..." },
  };

  const config = statusConfig[status];
  const displayText = text || config.text;

  if (status === "idle" && !text) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center gap-3"
      >
        <div className="relative">
          {/* Outer ring animation */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: config.color }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner dot with pulse */}
          <motion.div
            className="relative h-3 w-3 rounded-full"
            style={{ backgroundColor: config.color }}
            animate={
              status !== "idle"
                ? {
                    scale: [1, 1.1, 1],
                  }
                : undefined
            }
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.span
          className="text-sm font-medium"
          style={{ color: config.color }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {displayText}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
