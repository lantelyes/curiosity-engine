'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';

interface TranscriptMessage {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs Conversational AI');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Received message:', message);
      
      // Handle different message types from ElevenLabs
      if (message.type === 'user_transcript' && message.text) {
        const userMessage: TranscriptMessage = {
          id: `user-${Date.now()}`,
          speaker: 'user',
          text: message.text,
          timestamp: new Date(),
        };
        setTranscript(prev => [...prev, userMessage]);
      } else if (message.type === 'agent_response' && message.text) {
        const assistantMessage: TranscriptMessage = {
          id: `assistant-${Date.now()}`,
          speaker: 'assistant',
          text: message.text,
          timestamp: new Date(),
        };
        setTranscript(prev => [...prev, assistantMessage]);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setError(error.message || 'An error occurred');
    },
  });

  useEffect(() => {
    // Auto-scroll to bottom of transcript
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with the agent
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      
      if (!agentId) {
        throw new Error('ElevenLabs Agent ID not configured');
      }
      
      await conversation.startSession({ 
        agentId: agentId 
      });
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setTranscript([]);
    } catch (err) {
      console.error('Failed to stop conversation:', err);
    }
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
            AI Interview Assistant
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={isConnected ? stopConversation : startConversation}
            disabled={isConnecting}
            className={`rounded-full px-8 py-4 text-lg font-medium transition-all duration-200 ${
              isConnected
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            } ${isConnecting ? 'cursor-not-allowed opacity-50' : ''} focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800`}
          >
            {isConnecting
              ? 'Connecting...'
              : isConnected
                ? 'End Interview'
                : 'Start Interview'}
          </button>

          {isConnected && (
            <div className="mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The interview has begun. The AI will start with a question.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {conversation.isSpeaking ? 'AI is speaking...' : 'Listening...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Transcript Section */}
        {transcript.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Conversation Transcript
            </h2>
            <div className="max-h-96 overflow-y-auto rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              {transcript.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.speaker === 'user' ? 'text-left' : 'text-left'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span
                      className={`font-semibold ${
                        message.speaker === 'user'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {message.speaker === 'user' ? 'You:' : 'AI:'}
                    </span>
                    <span className="flex-1 text-gray-800 dark:text-gray-200">
                      {message.text}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}