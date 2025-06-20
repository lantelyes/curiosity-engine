"use client";

import { motion } from "framer-motion";
import { SurveyTopic } from "@/config/surveyTopics";
import StatusIndicator from "./StatusIndicator";

interface InterviewPanelProps {
  topic: SurveyTopic;
  status: "idle" | "connecting" | "listening" | "speaking";
  onEndInterview: () => void;
  children: React.ReactNode;
}

export default function InterviewPanel({
  topic,
  status,
  onEndInterview,
  children,
}: InterviewPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">{topic.icon}</span>
              <span>{topic.name}</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Live Interview
            </p>
          </div>
          <StatusIndicator status={status} />
        </div>
      </div>

      {/* Transcript Area */}
      <div className="flex-1 overflow-hidden p-4">
        {children}
      </div>

      {/* Controls */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Recording</span>
          </div>
          <motion.button
            onClick={onEndInterview}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            End Interview
          </motion.button>
        </div>
      </div>
    </div>
  );
}