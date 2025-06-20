"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EarningsOverview() {
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [weekData, setWeekData] = useState<{ day: string; amount: number }[]>([]);

  useEffect(() => {
    // Load earnings data from localStorage
    const daily = parseFloat(localStorage.getItem("dailyEarnings") || "0");
    const completed = parseInt(localStorage.getItem("completedToday") || "0");
    
    setDailyEarnings(daily);
    setCompletedToday(completed);

    // Generate week data (mock for now, could be stored in localStorage)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    const weeklyData = days.map((day, index) => ({
      day,
      amount: index < today ? Math.random() * 30 + 10 : 0,
    }));
    weeklyData[today === 0 ? 6 : today - 1].amount = daily; // Set today's earnings
    
    const weekTotal = weeklyData.reduce((sum, day) => sum + day.amount, 0);
    setWeeklyEarnings(weekTotal);
    setWeekData(weeklyData);
  }, []);

  const dailyGoal = 25;
  const dailyProgress = Math.min((dailyEarnings / dailyGoal) * 100, 100);

  return (
    <div className="h-full flex flex-col">
      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Today's Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Today&apos;s Earnings
          </h3>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              ${dailyEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completedToday} surveys completed
            </div>
          </div>
          
          {/* Daily Goal Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Goal</span>
              <span>${dailyGoal}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {dailyProgress < 100 
                ? `$${(dailyGoal - dailyEarnings).toFixed(2)} to go`
                : "Goal achieved! 🎉"
              }
            </div>
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            This Week
          </h3>
          <div className="space-y-2">
            {weekData.slice(0, new Date().getDay() || 7).map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">{day.day}</span>
                <span className={day.amount > 0 ? "font-medium" : "text-gray-400"}>
                  ${day.amount.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between font-semibold">
              <span>Week Total</span>
              <span className="text-green-600 dark:text-green-400">
                ${weeklyEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Achievement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm font-medium">Keep it up!</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Complete {Math.max(5 - completedToday, 0)} more surveys to unlock bonus rewards
          </div>
        </motion.div>
      </div>
    </div>
  );
}