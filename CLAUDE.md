# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server with Turbopack
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
```

## Architecture Overview

This is a Next.js 15 application using:

- **App Router** (not Pages Router) - components are in `src/app/`
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **pnpm** as the package manager (v10.12.1+)
- **Node.js** requirement: >=18.0.0

### Key Files

- `src/app/layout.tsx` - Root layout with Geist fonts and global styles
- `src/app/page.tsx` - Homepage component with OpenAI Realtime WebRTC integration
- `src/app/globals.css` - Global styles and Tailwind imports
- `tsconfig.json` - TypeScript config with `@/*` alias for `src/*`

### OpenAI Realtime API Integration

The application includes a WebRTC-based integration with OpenAI's Realtime API:

- `src/utils/webrtc-client.ts` - WebRTC client for real-time audio communication
- `src/app/api/realtime/session/route.ts` - Endpoint to generate ephemeral tokens
- `src/app/api/realtime/webrtc/route.ts` - Endpoint for SDP exchange
- Uses WebRTC peer connections for low-latency audio streaming
- Audio is handled automatically by the browser (no manual PCM conversion needed)
- Default model: `gpt-4o-realtime-preview-2025-06-03` (configurable via `OPENAI_REALTIME_MODEL` env var)

### Development Setup

- ESLint configured with Next.js, TypeScript, and Prettier rules
- Prettier configured with Tailwind CSS plugin for class sorting
- Development server runs on http://localhost:3000
