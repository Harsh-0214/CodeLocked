# Harsh's Dev Lessons

A personal software engineering knowledge base built with Next.js 15 and Vercel KV. Lessons are captured from conversations using the trigger phrase **"log this to my lesson site"** via a Claude skill.

## What This Is

A living wiki of software engineering concepts, patterns, and lessons learned. Each entry includes:
- Title, summary, and full content
- Difficulty level (beginner / intermediate / advanced)
- Category and tags
- Real world example
- Key takeaways
- Conversation context

## Trigger Phrase

When chatting with Claude (with the SKILL.md uploaded to your profile), say:

```
log this to my lesson site
```

Claude will extract the key lesson from the conversation and POST it to your deployed site via the `/api/lessons` endpoint.

## Tech Stack

- **Next.js 15** with App Router and TypeScript
- **Vercel KV** (Redis-backed key-value store) for persistence
- **Tailwind CSS** for styling
- **IBM Plex Mono + Fraunces + Geist** fonts

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Harsh-0214/CodeLocked.git
cd CodeLocked
npm install
```

### 2. Create a Vercel KV database

1. Go to [vercel.com](https://vercel.com) and open your project (or create one by importing this repo)
2. Navigate to **Storage** -> **Create Database** -> **KV**
3. Copy the environment variables shown

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the KV values from Vercel, and set a secure `LESSON_API_SECRET`:

```
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
LESSON_API_SECRET=some-long-random-secret
```

### 4. Update SKILL.md

Edit `SKILL.md` with your deployed URL and API secret, then upload it to:
claude.ai -> profile -> My Skills

### 5. Deploy

```bash
npx vercel --prod
```

Add the same env vars in the Vercel dashboard under **Settings -> Environment Variables**.

## API

All write endpoints require the `x-api-secret` header matching `LESSON_API_SECRET`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/lessons` | List all lessons |
| POST | `/api/lessons` | Create a lesson |
| GET | `/api/lessons/:id` | Get a lesson |
| PATCH | `/api/lessons/:id` | Update a lesson |
| DELETE | `/api/lessons/:id` | Delete a lesson |
