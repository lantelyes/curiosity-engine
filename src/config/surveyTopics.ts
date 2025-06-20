export interface SurveyTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  estimatedMinutes: number;
  ratePerMinute: number;
  initialQuestion: string;
  color: string;
}

export const surveyTopics: SurveyTopic[] = [
  {
    id: "food-dining",
    name: "Food & Dining",
    icon: "🍔",
    description: "Share your dining preferences and food experiences",
    estimatedMinutes: 8,
    ratePerMinute: 0.42,
    initialQuestion: "What are your favorite types of cuisine and how often do you dine out?",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "💻",
    description: "Discuss your tech habits and device preferences",
    estimatedMinutes: 10,
    ratePerMinute: 0.45,
    initialQuestion: "How do you use technology in your daily life and what devices do you rely on most?",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    icon: "🏥",
    description: "Talk about your health routines and wellness goals",
    estimatedMinutes: 10,
    ratePerMinute: 0.50,
    initialQuestion: "What does a healthy lifestyle mean to you and what wellness practices do you follow?",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "travel",
    name: "Travel",
    icon: "✈️",
    description: "Share your travel experiences and dream destinations",
    estimatedMinutes: 12,
    ratePerMinute: 0.48,
    initialQuestion: "What are your favorite travel destinations and what type of traveler are you?",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "shopping",
    name: "Shopping Habits",
    icon: "🛍️",
    description: "Discuss your shopping preferences and buying decisions",
    estimatedMinutes: 8,
    ratePerMinute: 0.40,
    initialQuestion: "How do you approach shopping and what influences your purchasing decisions?",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    description: "Talk about your entertainment preferences and leisure time",
    estimatedMinutes: 10,
    ratePerMinute: 0.44,
    initialQuestion: "What types of entertainment do you enjoy and how do you spend your leisure time?",
    color: "from-purple-500 to-indigo-500",
  },
];