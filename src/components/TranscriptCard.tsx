"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface TranscriptCardProps {
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
  index: number;
}

export default function TranscriptCard({
  speaker,
  text,
  timestamp,
  index,
}: TranscriptCardProps) {
  const isUser = speaker === "user";

  const formattedTime = useMemo(() => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 5 : -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: index * 0.02,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <motion.div
        className={`max-w-[80%] md:max-w-[70%] ${isUser ? "order-2" : "order-1"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isUser
              ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
              : "glass"
          }`}
        >
          <div className="flex items-start gap-2 mb-1">
            <div
              className={`text-xs font-semibold ${
                isUser ? "text-white/90" : "text-[var(--primary)]"
              }`}
            >
              {isUser ? "You" : "AI Assistant"}
            </div>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              isUser ? "text-white" : "text-[var(--foreground)]"
            }`}
          >
            {text}
          </p>

          <div
            className={`text-xs mt-2 ${
              isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
