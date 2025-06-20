# AI Interview Assistant (OpenAI Realtime API + WebRTC)

This Next.js application implements an AI-powered interview assistant using OpenAI's Realtime API with WebRTC for natural voice conversations.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up your OpenAI API key:

   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How it Works

- Click the "Start Interview" button to begin the interview
- The app will request microphone permission to capture your voice
- The AI interviewer will start by asking: "Tell me about a special moment that happened to you in the last week"
- Speak naturally and the AI will respond with follow-up questions
- A real-time transcript appears below showing the entire conversation
- The AI will guide the conversation with curiosity while gently steering back to meaningful experiences
- Click "End Interview" to stop the conversation

## Technical Details

### WebRTC Implementation

- Uses WebRTC for real-time audio communication
- Establishes peer connection with OpenAI's servers
- Audio streams are handled automatically by the browser
- Data channel is used for session events and configuration

### Interview Features

- AI acts as an empathetic interviewer
- Starts with a specific opening question
- Asks thoughtful follow-up questions
- Gently guides conversation back to meaningful topics
- Shows genuine curiosity and empathy

### Transcript Feature

- Real-time transcription of both user and AI speech
- User input transcribed using Whisper model
- AI responses shown as they're generated
- Timestamps for each message
- Auto-scrolling to latest messages
- Perfect for capturing interview content

### Architecture

- `/api/realtime/session` - Creates ephemeral tokens for secure client-side authentication
- `/api/realtime/webrtc` - Handles SDP exchange for WebRTC connection establishment
- `/utils/webrtc-client.ts` - WebRTC client implementation

## Configuration

### Environment Variables

- `OPENAI_API_KEY` - Required. Your OpenAI API key with Realtime API access
- `OPENAI_REALTIME_MODEL` - Optional. Defaults to `gpt-4o-realtime-preview-2025-06-03`

### Available Models

As of 2025, the following realtime models are available:

- `gpt-4o-realtime-preview-2025-06-03` - Latest full-featured model (default)
- `gpt-4o-mini-realtime-preview` - Lower-cost option with similar capabilities
- `gpt-4o-realtime-preview-2024-12-17` - Previous version

## Important Notes

- You need a valid OpenAI API key with access to the Realtime API
- Voice is set to "alloy" by default
- WebRTC provides lower latency compared to WebSocket implementations
- Browser handles all audio encoding/decoding automatically
- The models use the same underlying GPT-4o audio model but are optimized for low-latency, real-time interactions
