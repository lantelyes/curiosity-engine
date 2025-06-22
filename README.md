# CuriosityEngine 💰

An interactive survey platform that rewards users for sharing their experiences through AI-powered voice interviews. Built with Next.js, ElevenLabs Conversational AI, and Prisma.

## Features

- **Voice-based Surveys**: Natural conversations with an AI interviewer
- **Earnings System**: Get paid for completing surveys (real-time earnings tracking)
- **Topic Selection**: Choose from various survey categories
- **Live Transcripts**: Real-time transcription of conversations
- **User Authentication**: Secure login with NextAuth.js
- **Progress Tracking**: View earnings history and statistics
- **Database Storage**: Persistent data with Prisma and MySQL

## Prerequisites

- Node.js 18.0.0 or higher
- pnpm 10.12.1 or higher
- MySQL database (or other Prisma-supported database)
- An ElevenLabs account with a Conversational AI agent
- Google OAuth credentials (for NextAuth.js authentication)

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

3. Set up the database:

```bash
# Initialize Prisma and create database tables
pnpm prisma db push

# (Optional) Seed the database with sample data
pnpm prisma db seed
```

4. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your configuration:

```bash
# Database (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/curiosity_engine"

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-elevenlabs-agent-id-here

# NextAuth.js
AUTH_SECRET=your-auth-secret-here
AUTH_URL=http://localhost:3000

# Google OAuth (required for authentication)
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
```

5. Configure your ElevenLabs agent:
   - Log in to your [ElevenLabs dashboard](https://elevenlabs.io)
   - Create a new Conversational AI agent
   - Configure the agent as an empathetic interviewer
   - Set up dynamic variables for `initial_question` and `survey_topic`
   - Copy the Agent ID to your environment variables

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. Sign in with your preferred authentication method
2. Browse available survey topics on the main screen
3. Select a topic that interests you
4. Click "Start Interview" to begin the conversation
5. Allow microphone access when prompted
6. Answer the AI interviewer's questions naturally
7. Watch your earnings accumulate in real-time
8. Click "End Interview" when you're done
9. Your earnings are automatically saved to your account

## Project Structure

```
src/
├── app/
│   ├── page.tsx          - Main dashboard with topic selection
│   ├── layout.tsx        - Root layout with authentication
│   ├── actions/          - Server actions for earnings
│   ├── api/
│   │   ├── auth/         - NextAuth.js endpoints
│   │   ├── earnings/     - Earnings API routes
│   │   └── interviews/   - Interview data endpoints
│   ├── login/            - Login page
│   └── protected/        - Protected routes
├── components/
│   ├── TopicGrid.tsx     - Survey topic selection grid
│   ├── InterviewPanel.tsx - Active interview interface
│   ├── EarningsPanel.tsx - Real-time earnings tracker
│   ├── EarningsOverview.tsx - Earnings statistics display
│   ├── TranscriptContainer.tsx - Live conversation transcript
│   ├── UserProfile.tsx   - User authentication status
│   ├── SessionProvider.tsx - NextAuth session provider
│   └── ui/               - Reusable UI components
├── config/
│   └── surveyTopics.ts   - Available survey configurations
├── lib/
│   ├── auth.ts           - NextAuth configuration
│   ├── auth.config.ts    - Edge-compatible auth config
│   └── prisma.ts         - Prisma client instance
├── types/
│   └── next-auth.d.ts    - NextAuth type extensions
└── middleware.ts         - Authentication middleware

prisma/
└── schema.prisma         - Database schema
```

## Technologies

- [Next.js 15.3.4](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - UI library
- [TypeScript 5](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling framework
- [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) - AI voice agent platform
- [Prisma 6.10](https://www.prisma.io) - Type-safe database ORM
- [NextAuth.js v5 Beta](https://authjs.dev) - Authentication framework
- [Framer Motion 12](https://www.framer.com/motion) - Animation library
- [pnpm 10.12.1](https://pnpm.io) - Fast, efficient package manager

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
pnpm lint:fix

# Format code
pnpm format
pnpm format:check

# Type checking
pnpm typecheck

# Run all checks
pnpm check-all

# Database commands
pnpm prisma studio     # Open Prisma Studio
pnpm prisma db push    # Push schema changes
pnpm prisma generate   # Generate Prisma Client
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).