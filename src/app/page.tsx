'use client';

import { useState, useEffect, useRef } from 'react';
import { WebRTCClient } from '@/utils/webrtc-client';

interface TranscriptMessage {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<WebRTCClient | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const currentAssistantMessage = useRef<string>('');
  const currentResponseId = useRef<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (client) {
        client.close();
      }
    };
  }, [client]);

  useEffect(() => {
    // Auto-scroll to bottom of transcript
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const startRealtimeChat = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get ephemeral token from our API
      const response = await fetch('/api/realtime/session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to get session token');
      }

      const data = await response.json();
      const ephemeralKey = data.token;

      console.log('Got ephemeral key');

      // Create WebRTC client
      const webrtcClient = new WebRTCClient({
        onOpen: () => {
          console.log('Connected to OpenAI Realtime API via WebRTC');

          // Configure session
          webrtcClient.updateSession({
            modalities: ['text', 'audio'],
            instructions: `You are a warm, empathetic interviewer conducting a meaningful conversation. Your role is to help people reflect on and share their experiences.

Start the conversation by asking: "Tell me about a special moment that happened to you in the last week."

PRIMARY OBJECTIVE: Thoroughly explore their special moment BEFORE allowing any topic changes. You must understand:
- What happened in detail (who, what, where, when)
- How it made them feel (specific emotions and physical sensations)
- Why it was meaningful to them (personal significance)
- What they learned or took away from it (insights gained)

As an interviewer:
- Listen actively and show genuine curiosity about their experiences
- Ask follow-up questions that dig deeper into emotions, details, and meanings
- Use phrases like "That's interesting, can you tell me more about..." or "How did that make you feel?"
- Keep a conversational, natural tone - this is a dialogue, not an interrogation
- Show empathy and validate their experiences
- Ask one question at a time and give them space to think and respond

CRITICAL: MANAGING TOPIC DRIFT
You MUST actively prevent topic changes until the special moment is fully explored. When someone tries to change the subject, respond immediately:

1. IMMEDIATE RESPONSE TO TOPIC CHANGE:
   - "I hear you want to talk about [new topic], and we can definitely discuss that later. But first, I'm really intrigued by [specific detail from their moment]. Can you tell me more about that part?"
   - "That's interesting! Let's bookmark that thought. Right now, I want to understand more about how you felt when [reference their moment]."

2. IF THEY INSIST ON CHANGING TOPICS:
   - "I appreciate you sharing that, and I'd love to explore it with you. But I feel we haven't fully unpacked your special moment yet. What was going through your mind when [specific aspect] happened?"
   - "I can tell [new topic] is important to you, and we'll definitely come back to it. But I'm genuinely curious - what made [their moment] stand out from other experiences that week?"

3. IF THEY SAY "LET'S CHANGE THE SUBJECT":
   - "I understand you might want to move on, but I sense there's more to your story that could be valuable to explore. Sometimes the most meaningful insights come from sitting with an experience a bit longer. What else do you remember about that moment?"
   - "Of course we can shift topics soon, but I'd feel like I'm doing you a disservice if we didn't fully explore this meaningful experience first. What aspect of it surprised you most?"

IMPORTANT GUIDELINES:
- Do NOT accept topic changes until you've spent at least 10-15 exchanges exploring their special moment
- Always acknowledge their desire to change topics, but firmly guide back
- Use specific details from their story to show you're engaged and pull them back in
- It's your responsibility as an interviewer to help them gain deeper insights through thorough exploration
- Be persistent but warm - this is for their benefit, not yours`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1',
            },
            turn_detection: {
              type: 'server_vad',
            },
          });

          // Trigger the AI to start the conversation with the initial question
          setTimeout(() => {
            webrtcClient.send({
              type: 'response.create',
            });
          }, 500); // Small delay to ensure session is configured

          setIsConnected(true);
          setIsConnecting(false);
        },
        onMessage: (event) => {
          console.log('Received event:', event.type);

          switch (event.type) {
            case 'session.created':
              console.log('Session created');
              break;

            case 'session.updated':
              console.log('Session updated');
              break;

            case 'conversation.item.input_audio_transcription.completed':
              // User's speech transcribed
              if (event.transcript) {
                const userMessage: TranscriptMessage = {
                  id: (event.item_id as string) || Date.now().toString(),
                  speaker: 'user',
                  text: event.transcript as string,
                  timestamp: new Date(),
                };
                setTranscript((prev) => [...prev, userMessage]);
              }
              break;

            case 'response.created':
              // New response started
              console.log('Response created event:', event);
              const responseData = event.response as { id?: string } | undefined;
              const responseId = (responseData?.id || event.response_id || Date.now().toString()) as string;
              currentResponseId.current = responseId;
              currentAssistantMessage.current = '';
              setTypingMessage('');
              break;

            case 'response.text.delta':
              // Assistant's text response (partial)
              if (event.delta) {
                // Set response ID if we haven't seen response.created
                if (!currentResponseId.current && event.response_id) {
                  currentResponseId.current = event.response_id as string;
                }
                currentAssistantMessage.current += event.delta as string;
                setTypingMessage(currentAssistantMessage.current);
                console.log('Text delta:', event.delta);
              }
              break;

            case 'response.text.done':
              // Assistant's text response (complete) - DO NOT overwrite accumulated text
              console.log('Text done event:', event);
              // We already have the complete text from deltas, so we don't need to do anything here
              break;

            case 'response.audio_transcript.delta':
              // Assistant's audio transcript (partial)
              if (event.delta) {
                currentAssistantMessage.current += event.delta as string;
                setTypingMessage(currentAssistantMessage.current);
                console.log('Audio transcript delta:', event.delta);
              }
              break;

            case 'response.audio_transcript.done':
              // Assistant's audio transcript (complete) - DO NOT overwrite accumulated text
              console.log('Audio transcript done event:', event);
              // We already have the complete text from deltas, so we don't need to do anything here
              break;

            case 'response.done':
              // Response complete - now add the message to transcript
              console.log('Response done event:', event, 'Current message:', currentAssistantMessage.current);
              if (currentAssistantMessage.current) {
                const assistantMessage: TranscriptMessage = {
                  id: currentResponseId.current || Date.now().toString(),
                  speaker: 'assistant',
                  text: currentAssistantMessage.current,
                  timestamp: new Date(),
                };
                setTranscript((prev) => [...prev, assistantMessage]);
                currentAssistantMessage.current = '';
                currentResponseId.current = null;
                setTypingMessage('');
              }
              break;

            case 'response.audio.delta':
            case 'response.audio.done':
              // Audio is handled automatically via WebRTC
              console.log('Audio event:', event.type);
              break;

            case 'conversation.interrupted':
              console.log('Conversation interrupted');
              currentAssistantMessage.current = '';
              currentResponseId.current = null;
              setTypingMessage('');
              break;

            case 'error':
              console.error('Realtime error:', event);
              setError(event.error?.message || 'An error occurred');
              break;

            default:
              // Log other events for debugging
              if (
                event.type.startsWith('response.') ||
                event.type.startsWith('conversation.')
              ) {
                console.log('Event:', event.type, event);
                
                // Handle any response event that might have content we missed
                if (event.type.includes('response.') && event.type.includes('.content') && event.text) {
                  if (!currentAssistantMessage.current && typeof event.text === 'string') {
                    currentAssistantMessage.current = event.text;
                    setTypingMessage(event.text);
                  }
                }
              }
          }
        },
        onError: (error) => {
          console.error('Connection error:', error);
          setError(error);
          cleanup();
        },
        onClose: () => {
          console.log('Connection closed');
          cleanup();
        },
      });

      // Connect to OpenAI via WebRTC
      await webrtcClient.connect(ephemeralKey);
      setClient(webrtcClient);
    } catch (err) {
      console.error('Error starting realtime chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to start chat');
      setIsConnecting(false);
    }
  };

  const stopRealtimeChat = () => {
    cleanup();
  };

  const cleanup = () => {
    if (client) {
      client.close();
      setClient(null);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setTranscript([]);
    currentAssistantMessage.current = '';
    currentResponseId.current = null;
    setTypingMessage('');
  };

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
            onClick={isConnected ? stopRealtimeChat : startRealtimeChat}
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
                  Listening...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Transcript Section */}
        {(transcript.length > 0 || typingMessage) && (
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
              
              {/* Show current assistant message being typed */}
              {typingMessage && (
                <div className="mb-4 text-left">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      AI:
                    </span>
                    <span className="flex-1 text-gray-800 dark:text-gray-200">
                      {typingMessage}
                      <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-gray-400"></span>
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
