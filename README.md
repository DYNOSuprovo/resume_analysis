# Resume-to-Roadmap SaaS - Quick Start Guide

## Prerequisites

1. **Database Setup**:
   - Install PostgreSQL locally OR use a managed service (Supabase/Neon)
   - For Supabase: https://supabase.com/ (free tier available)
   - For Neon: https://neon.tech/ (free tier available)

2. **Gemini API Key**:
   - Get your API key from: https://makersuite.google.com/app/apikey
   - Free tier includes 60 requests per minute

## Setup Instructions

1. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```

2. **Add your environment variables** to `.env`:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   GEMINI_API_KEY="your_gemini_api_key"
   NEXTAUTH_SECRET="run: openssl rand -base64 32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Push database schema**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   - Navigate to http://localhost:3000
   - Click "Get Started Free"
   - Upload a resume (PDF or DOCX)
   - Set your career goal
   - Watch AI generate your personalized roadmap!

## What's Working (MVP)

✅ Landing page with premium UI
✅ Resume upload & AI parsing
✅ Personalized roadmap generation with Gemini
✅ Interactive dashboard with progress tracking
✅ Task completion with checkboxes
✅ Beautiful animations and glassmorphism effects

## What's Next (Future Phases)

- Authentication (Google OAuth + email/password)
- AI Career Coach chat
- Resource library with curated links
- Analytics dashboard
- Billing & subscriptions
- Gamification (streaks, XP, levels)

## Troubleshooting

**"No database found"**: Make sure `DATABASE_URL` is set and `npm run db:push` completed successfully.

**"GEMINI_API_KEY is not set"**: Add your Gemini API key to the `.env` file.

**Resume upload fails**: Check file is PDF or DOCX and under 10MB.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini 1.5 Pro
- **File Parsing**: pdf-parse, mammoth

Enjoy building your learning roadmap! 🚀
