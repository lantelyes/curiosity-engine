"use client";

import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import TranscriptContainer from "@/components/TranscriptContainer";
import InterviewPanel from "@/components/InterviewPanel";
import EarningsPanel from "@/components/EarningsPanel";
import TopicGrid from "@/components/TopicGrid";
import EarningsOverview from "@/components/EarningsOverview";
import { UserProfile } from "@/components/UserProfile";
import { surveyTopics, SurveyTopic } from "@/config/surveyTopics";
import { saveEarning, getEarningsStats } from "@/app/actions/earnings";

interface TranscriptMessage {
  id: string;
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SurveyTopic | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    // Load total balance from database
    const loadStats = async () => {
      try {
        const stats = await getEarningsStats();
        setTotalBalance(stats.total);
      } catch {
        // Failed to load earnings stats
        // Fallback to localStorage for offline support
        const total = parseFloat(localStorage.getItem("totalEarnings") || "0");
        setTotalBalance(total);
      }
    };
    loadStats();
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      // Connected to ElevenLabs Conversational AI
      setError(null);
    },
    onDisconnect: () => {
      // Disconnected from ElevenLabs
    },
    onMessage: ({ message, source }) => {
      // Received message

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
      // Conversation error occurred
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An error occurred";
      setError(errorMessage);
    },
  });

  const startConversation = useCallback(
    async (topic: SurveyTopic) => {
      try {
        setError(null);
        setSelectedTopic(topic);
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
        if (!agentId) {
          throw new Error("ElevenLabs Agent ID not configured");
        }

        const sessionOptions = {
          agentId,
          dynamicVariables: {
            initial_question: topic.initialQuestion,
            survey_topic: topic.name,
          },
        };

        await conversation.startSession(sessionOptions);
        setSessionStartTime(new Date());
      } catch (err) {
        // Failed to start conversation
        setError(
          err instanceof Error ? err.message : "Failed to start conversation",
        );
      }
    },
    [conversation],
  );

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();

      // Save earnings to database
      if (currentEarnings > 0 && selectedTopic && sessionStartTime) {
        const duration = Math.floor(
          (new Date().getTime() - sessionStartTime.getTime()) / 1000,
        );

        try {
          await saveEarning(
            selectedTopic.id,
            selectedTopic.name,
            currentEarnings,
            duration,
          );
        } catch {
          // Failed to save earning to database
          // Fallback to localStorage
          const dailyEarnings = parseFloat(
            localStorage.getItem("dailyEarnings") || "0",
          );
          const completedToday = parseInt(
            localStorage.getItem("completedToday") || "0",
          );
          const totalEarnings = parseFloat(
            localStorage.getItem("totalEarnings") || "0",
          );
          const today = new Date().toDateString();
          const lastSaveDate = localStorage.getItem("lastSaveDate");

          if (lastSaveDate !== today) {
            // Reset daily stats if it's a new day
            localStorage.setItem("dailyEarnings", currentEarnings.toString());
            localStorage.setItem("completedToday", "1");
          } else {
            localStorage.setItem(
              "dailyEarnings",
              (dailyEarnings + currentEarnings).toString(),
            );
            localStorage.setItem(
              "completedToday",
              (completedToday + 1).toString(),
            );
          }
          localStorage.setItem("lastSaveDate", today);
          localStorage.setItem(
            "totalEarnings",
            (totalEarnings + currentEarnings).toString(),
          );
        }
      }

      setTranscript([]);
      setSelectedTopic(null);
      setSessionStartTime(null);
      setCurrentEarnings(0);
    } catch {
      // Failed to stop conversation
    }
  }, [conversation, currentEarnings, selectedTopic, sessionStartTime]);

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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="glass border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            💰 CuriosityEngine
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total Balance:{" "}
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${(totalBalance + currentEarnings).toFixed(2)}
              </span>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 glass rounded-lg p-4 border border-red-500/20 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Dynamic Content */}
        <div className="flex-1 glass border-r border-gray-200 dark:border-gray-800">
          <AnimatePresence mode="wait">
            {!selectedTopic ? (
              <motion.div
                key="topic-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <TopicGrid
                  topics={surveyTopics}
                  onSelectTopic={startConversation}
                />
              </motion.div>
            ) : (
              <motion.div
                key="interview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <InterviewPanel
                  topic={selectedTopic}
                  status={getStatus()}
                  onEndInterview={stopConversation}
                >
                  <TranscriptContainer
                    messages={transcript}
                    fullScreen={false}
                  />
                </InterviewPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Earnings */}
        <div className="w-96 glass">
          <AnimatePresence mode="wait">
            {!selectedTopic || !sessionStartTime ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <EarningsOverview />
              </motion.div>
            ) : (
              <motion.div
                key="live-earnings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <EarningsPanel
                  topic={selectedTopic}
                  startTime={sessionStartTime}
                  onEarningsUpdate={setCurrentEarnings}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
