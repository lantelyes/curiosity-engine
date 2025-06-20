# AI Interview Assistant

An interactive AI interview assistant built with Next.js and ElevenLabs Conversational AI.

## Features

- Real-time voice conversations with an AI interviewer
- Automatic speech recognition and synthesis
- Live transcript display
- Built with Next.js 15 and TypeScript

## Prerequisites

- Node.js 18.0.0 or higher
- pnpm 10.12.1 or higher
- An ElevenLabs account with a Conversational AI agent

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/curiosity-engine.git
cd curiosity-engine
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your ElevenLabs API key and Agent ID:
```bash
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-elevenlabs-agent-id-here
```

4. Configure your ElevenLabs agent:
   - Log in to your [ElevenLabs dashboard](https://elevenlabs.io)
   - Create a new Conversational AI agent
   - Configure the agent with your desired personality and instructions
   - Copy the Agent ID to your environment variables

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. Click "Start Interview" to begin the conversation
2. Allow microphone access when prompted
3. The AI will start with an interview question
4. Speak naturally - your responses will be transcribed in real-time
5. Click "End Interview" to stop the conversation

## Project Structure

- `src/app/page.tsx` - Main application component with ElevenLabs integration
- `src/app/layout.tsx` - Root layout with fonts and global styles
- `src/app/globals.css` - Global styles and Tailwind CSS imports

## Technologies

- [Next.js 15](https://nextjs.org) - React framework
- [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) - AI voice agent platform
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [pnpm](https://pnpm.io) - Package manager

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).