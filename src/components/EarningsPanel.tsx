"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { SurveyTopic } from "@/config/surveyTopics";

interface EarningsPanelProps {
  topic: SurveyTopic;
  startTime: Date;
  onEarningsUpdate: (earnings: number) => void;
}

export default function EarningsPanel({
  topic,
  startTime,
  onEarningsUpdate,
}: EarningsPanelProps) {
  const [earnings, setEarnings] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [previousEarnings, setPreviousEarnings] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = (now.getTime() - startTime.getTime()) / 1000; // seconds
      const minutes = elapsed / 60;
      const newEarnings = minutes * topic.ratePerMinute;

      setElapsedTime(elapsed);
      setPreviousEarnings(earnings);
      setEarnings(newEarnings);
      onEarningsUpdate(newEarnings);
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, topic.ratePerMinute, onEarningsUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = Math.min(
    (earnings / (topic.estimatedMinutes * topic.ratePerMinute)) * 100,
    100,
  );
  const dailyEarnings = parseFloat(
    localStorage.getItem("dailyEarnings") || "0",
  );
  const completedToday = parseInt(
    localStorage.getItem("completedToday") || "0",
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h2 className="text-xl font-semibold">💰 Earnings Tracker</h2>
      </div>

      {/* Current Session */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Current Session
          </h3>
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="relative">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                <CountUp
                  start={previousEarnings}
                  end={earnings}
                  duration={0.5}
                  decimals={2}
                  decimal="."
                  prefix="$"
                  preserveValue={true}
                />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                💰
              </motion.div>
            </div>
            <motion.div
              className="text-xs text-gray-500 dark:text-gray-400 mt-2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              earning steadily
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Rate</span>
            <span className="font-medium">
              ${topic.ratePerMinute.toFixed(2)}/min
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Time</span>
            <span className="font-medium">{formatTime(elapsedTime)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="glass rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Today&apos;s Earnings
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Completed
              </span>
              <span className="font-medium">{completedToday} surveys</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                ${(dailyEarnings + earnings).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
