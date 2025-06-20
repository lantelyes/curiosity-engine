"use client";

import { motion } from "framer-motion";
import { SurveyTopic } from "@/config/surveyTopics";

interface TopicCardProps {
  topic: SurveyTopic;
  onClick: () => void;
}

export default function TopicCard({ topic, onClick }: TopicCardProps) {
  const estimatedEarnings = (topic.ratePerMinute * topic.estimatedMinutes).toFixed(2);

  return (
    <motion.button
      onClick={onClick}
      className="glass rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 group"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic.icon}</span>
            <h3 className="text-lg font-semibold">{topic.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${topic.color} text-white text-sm font-medium`}>
            ${estimatedEarnings}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {topic.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>~{topic.estimatedMinutes} minutes</span>
          <span>${topic.ratePerMinute.toFixed(2)}/min</span>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Start Survey</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}