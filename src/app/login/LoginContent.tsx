"use client";

import { AuthButton } from "@/components/AuthButton";
import { motion } from "framer-motion";

export default function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
              💰 CuriosityEngine
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Earn money for your opinions
            </p>
          </div>

          {/* Sign In Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to start earning from AI-powered interviews
              </p>
            </div>

            <AuthButton />

            {/* Features */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Earn $1-$5 per interview
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Share your opinions on trending topics
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Get paid instantly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400"
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
