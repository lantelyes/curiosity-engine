"use client";

import { motion } from "framer-motion";
import { SurveyTopic } from "@/config/surveyTopics";
import TopicCard from "./TopicCard";

interface TopicGridProps {
  topics: SurveyTopic[];
  onSelectTopic: (topic: SurveyTopic) => void;
}

export default function TopicGrid({ topics, onSelectTopic }: TopicGridProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Topic Cards Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto auto-rows-fr">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <TopicCard topic={topic} onClick={() => onSelectTopic(topic)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
