"use client";

import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";
import StatusIndicator from "@/components/StatusIndicator";
import TranscriptContainer from "@/components/TranscriptContainer";

interface TranscriptMessage {
  id: string;
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs Conversational AI");
      setError(null);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: ({ message, source }) => {
      console.log("Received message:", { message, source });

      if (message && source) {
        const transcriptMessage: TranscriptMessage = {
          id: `${source}-${Date.now()}`,
          speaker: source as "user" | "ai",
          text: message,
          timestamp: new Date(),
        };
        setTranscript((prev) => [...prev, transcriptMessage]);
      }
    },
    onError: (error: unknown) => {
      console.error("Conversation error:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An error occurred";
      setError(errorMessage);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        throw new Error("ElevenLabs Agent ID not configured");
      }

      await conversation.startSession({ agentId });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start conversation",
      );
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setTranscript([]);
    } catch (err) {
      console.error("Failed to stop conversation:", err);
    }
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

  const getStatus = () => {
    if (isConnecting) return "connecting";
    if (isConnected) {
      return conversation.isSpeaking ? "speaking" : "listening";
    }
    return "idle";
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isConnected ? (
          /* Landing View */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen flex items-center justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-4xl">
              {/* Header Section */}
              <motion.div
                className="text-center mb-12"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                  Curiosity Engine
                </h1>

                <motion.p
                  className="text-lg md:text-xl text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  Explore ideas through intelligent conversation
                </motion.p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mb-6 glass rounded-xl p-4 border-l-4 border-red-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start Button */}
              <div className="flex flex-col items-center">
                <AnimatedButton
                  onClick={startConversation}
                  disabled={isConnecting}
                  variant="primary"
                  size="lg"
                  className="min-w-[200px]"
                >
                  <AnimatePresence mode="wait">
                    {isConnecting ? (
                      <motion.div
                        key="connecting"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center gap-2"
                      >
                        {/* Spinner */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />

                        <span>Connecting...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="start"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        Start Interview
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AnimatedButton>
              </div>

              {/* Floating decoration elements */}
              <motion.div
                className="fixed top-20 right-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full filter blur-3xl opacity-20 pointer-events-none hidden md:block"
                animate={{
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="fixed bottom-20 left-10 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-tr from-[var(--accent)] to-[var(--secondary)] rounded-full filter blur-3xl opacity-20 pointer-events-none hidden md:block"
                animate={{
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        ) : (
          /* Interview View */
          <motion.div
            key="interview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-screen flex flex-col"
          >
            {/* Floating Controls */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              {/* Status Indicator - Left */}
              <div className="glass rounded-full px-4 py-2 shadow-lg">
                <StatusIndicator status={getStatus()} />
              </div>

              {/* End Interview Button - Right */}
              <motion.button
                onClick={stopConversation}
                className="text-sm font-medium text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden sm:inline">End Interview</span>
                <span className="sm:hidden">End</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>

            {/* Full-screen Transcript */}
            <div className="flex-1 pt-20 md:pt-24 pb-8">
              <TranscriptContainer messages={transcript} fullScreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
