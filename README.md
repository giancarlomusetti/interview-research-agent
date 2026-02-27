# Interview Research Agent

AI-powered interview preparation tool. Paste a job description and get a comprehensive, role-aware research briefing with tailored interview prep in ~20 seconds.

## What It Does

1. **Parses the job description** — extracts company, role, skills, responsibilities, seniority
2. **Researches the company** (6 parallel research streams):
   - Company overview
   - Recent news
   - Funding & financials
   - Key people / leadership
   - Products & tech stack
   - Culture & employee sentiment
3. **Generates interview prep** — questions they'll ask, questions to ask them, tailored talking points

Everything is filtered through the lens of the specific role — not generic advice.

## Architecture

```
Client (React)  ─── SSE ───>  /api/research (Next.js Route Handler)
                                    │
                        ┌───────────┤
                        ▼           ▼
                   Tavily API   OpenAI GPT-4o
                   (web search) (structured output)
```

**Pipeline**: 8 steps with 3-wave parallelization (parse JD → 3 parallel → 3 parallel → interview prep synthesis)

**Streaming**: Server-Sent Events emit progress updates and section data as each step completes, so the UI renders incrementally.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui, dark theme
- **AI**: OpenAI GPT-4o via Vercel AI SDK (`generateObject` for structured output)
- **Search**: Tavily API (web search for company research)
- **Rate Limiting**: In-memory, 10 requests/IP/day

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Tavily API key ([tavily.com](https://tavily.com) — free tier: 1,000 searches/month)

### Setup

```bash
git clone <repo-url>
cd interview-research-agent
npm install

# Copy env template and add your keys
cp .env.example .env.local
# Edit .env.local with your API keys

npm run dev
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `TAVILY_API_KEY` | Yes | Tavily search API key |
| `OPENAI_MODEL` | No | Override model (default: `gpt-4o`) |

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import the repo
2. Add `OPENAI_API_KEY` and `TAVILY_API_KEY` as environment variables
3. Deploy

The rate limiter uses in-memory storage, so it resets on each deployment/cold start. For production, consider Upstash Redis.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main page (client component)
│   └── api/research/route.ts     # SSE streaming endpoint
├── components/
│   ├── search-form.tsx           # JD input with example chips
│   ├── research-progress.tsx     # Step-by-step progress tracker
│   ├── report-view.tsx           # Report container
│   └── report-sections/          # Individual report cards
├── hooks/
│   └── use-research.ts           # SSE consumer hook
└── lib/
    ├── ai/
    │   ├── provider.ts           # LLM abstraction (OpenAI)
    │   └── prompts.ts            # All prompt templates
    ├── research/
    │   ├── pipeline.ts           # Orchestrator with parallelization
    │   ├── types.ts              # Zod schemas + TypeScript types
    │   └── steps/                # Individual research steps
    ├── search/
    │   └── client.ts             # Tavily wrapper
    └── rate-limit.ts             # In-memory IP rate limiter
```

## API Budget Per Research

- ~10-12 Tavily searches
- 8 OpenAI structured output calls
- Supports ~80-100 researches/month on Tavily free tier

## Future Improvements

- Resume input for gap analysis + strength mapping
- Save/share reports (Supabase + shareable URLs)
- PDF export
- Upstash Redis for durable rate limiting
- Cache popular companies
- Additional data sources (Crunchbase API, LinkedIn, etc.)
