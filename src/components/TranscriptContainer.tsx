"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import TranscriptCard from "./TranscriptCard";

interface TranscriptMessage {
  id: string;
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface TranscriptContainerProps {
  messages: TranscriptMessage[];
  fullScreen?: boolean;
}

export default function TranscriptContainer({
  messages,
  fullScreen = false,
}: TranscriptContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: fullScreen ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={fullScreen ? "h-full" : ""}
    >
      <div
        ref={containerRef}
        className={`${fullScreen ? "h-full" : "max-h-[400px] md:max-h-[500px] pr-2"} overflow-y-auto custom-scrollbar`}
      >
        <div className={fullScreen ? "max-w-4xl mx-auto p-4 md:p-8" : ""}>
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-center py-12 text-gray-500 dark:text-gray-400 ${fullScreen ? "min-h-[50vh] flex flex-col items-center justify-center" : ""}`}
              />
            ) : (
              messages.map((message, index) => (
                <TranscriptCard
                  key={message.id}
                  speaker={message.speaker}
                  text={message.text}
                  timestamp={message.timestamp}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>
    </motion.div>
  );
}
