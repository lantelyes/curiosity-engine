# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CuriosityEngine is an interactive survey platform that rewards users for participating in AI-powered voice interviews. It uses Next.js 15 with App Router, NextAuth.js for authentication, Prisma with MySQL for data persistence, and ElevenLabs Conversational AI for voice interactions.

## Essential Commands

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production (includes Prisma generation)
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm typecheck        # TypeScript type checking
pnpm check-all        # Run all checks (types, lint, build)

# Database
pnpm prisma studio    # Open Prisma Studio GUI
pnpm prisma db push   # Push schema changes to database
pnpm prisma generate  # Generate Prisma Client
```

## Architecture & Key Patterns

### Authentication Flow
- NextAuth.js v5 (Beta) handles authentication with Google OAuth
- Auth configuration in `src/lib/auth.ts`
- Protected routes use middleware in `src/middleware.ts`
- Session data accessible via `auth()` in server components and `useSession()` in client components

### Database Architecture
- Prisma ORM with MySQL database
- Schema defined in `prisma/schema.prisma`
- Models: User, Account, Session, Earning
- Database client singleton in `src/lib/prisma.ts`

### Server Actions Pattern
- Server actions in `src/app/actions/` for data mutations
- Example: `createEarning()` and `getEarnings()` in `earnings.ts`
- Used with `useActionState` hook for form handling

### Component Architecture
- Server Components by default (App Router)
- Client Components marked with "use client"
- Real-time updates use polling (e.g., EarningsPanel polls every 3 seconds)
- UI components in `src/components/ui/` follow shadcn/ui patterns

### ElevenLabs Integration
- Conversational AI widget embedded in InterviewPanel
- Configuration requires signed URL generation
- Real-time transcription and voice interaction
- Completion callbacks trigger earnings creation

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to `src/*`
- All components and utilities should be properly typed
- Avoid `any` types

## Development Guidelines

### State Management
- Server state managed through Server Actions
- Client state uses React hooks (useState, useEffect)
- Form state handled with useActionState
- No global state management library

### Styling
- Tailwind CSS v4 with PostCSS
- Utility-first approach
- Custom animations with Framer Motion
- Consistent color scheme using CSS variables

### Error Handling
- Server actions return `{ error: string }` on failure
- Client components display user-friendly error messages
- Console errors for debugging in development

### Performance
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Efficient database queries with Prisma
- Minimize client-side JavaScript

## Common Tasks

### Adding a New Survey Topic
1. Update TopicGrid component with new topic
2. Add corresponding SVG icon in public directory
3. Update types if needed

### Modifying Earnings Logic
1. Update server action in `src/app/actions/earnings.ts`
2. Modify database schema if needed
3. Run `pnpm prisma db push` and `pnpm prisma generate`
4. Update UI components that display earnings

### Adding New API Endpoints
1. Create route handler in `src/app/api/[endpoint]/route.ts`
2. Use NextAuth for authentication: `const session = await auth()`
3. Return NextResponse with appropriate status codes

## Environment Variables

Critical environment variables (see .env.example):
- `DATABASE_URL`: MySQL connection string
- `AUTH_SECRET`: NextAuth secret for JWT
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Google OAuth credentials
- `NEXT_PUBLIC_APP_URL`: Public app URL for callbacks