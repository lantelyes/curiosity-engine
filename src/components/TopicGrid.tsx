"use client";

import { motion } from "framer-motion";
import { SurveyTopic } from "@/config/surveyTopics";

interface TopicGridProps {
  topics: SurveyTopic[];
  onSelectTopic: (topic: SurveyTopic) => void;
}

export default function TopicGrid({ topics, onSelectTopic }: TopicGridProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-2">Select a Topic to Start Earning</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a survey topic that interests you
        </p>
      </div>

      {/* Topic Cards Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {topics.map((topic, index) => {
            const estimatedEarnings = (topic.ratePerMinute * topic.estimatedMinutes).toFixed(2);
            
            return (
              <motion.button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="glass rounded-xl p-6 text-left hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{topic.icon}</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${estimatedEarnings}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{topic.name}</h3>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">${topic.ratePerMinute}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{topic.estimatedMinutes} min</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Start Interview</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}