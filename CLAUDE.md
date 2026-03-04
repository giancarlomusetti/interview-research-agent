# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (rate limits disabled in dev mode)
npm run dev            # starts on http://localhost:3000

# Production build
npm run build
npm start

# Lint
npm run lint

# E2E tests (auto-starts dev server on port 3847)
npx playwright test
npx playwright test --grep "specific test name"
npx playwright test e2e/research-flow.spec.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `OPENAI_API_KEY` — GPT-4o for structured output
- `TAVILY_API_KEY` — Web search (free tier: 1,000 searches/month)
- `PERPLEXITY_API_KEY` — Real-time news via sonar-pro

Rate limits are automatically disabled when `NODE_ENV !== "production"`.

## Architecture

### Request Flow
1. User submits job description (+ optional resume) via `SearchForm`
2. `useResearch` hook (`src/hooks/use-research.ts`) POSTs to `/api/research`
3. Route handler (`src/app/api/research/route.ts`) checks rate limits, then runs the pipeline
4. Results stream back via **Server-Sent Events** as each step completes
5. `ReportView` renders sections progressively as SSE `section` events arrive

### Research Pipeline (3 Waves)
Defined in `src/lib/research/pipeline.ts`:

- **Wave 0** (sequential): `parse-jd` — GPT-4o extracts company, role, skills, seniority
- **Wave 1** (parallel): `company-overview`, `recent-news` (Perplexity), `financials`
- **Wave 2** (parallel, after Wave 1): `key-people`, `tech-and-product`, `culture`, `layoffs`
- **Wave 3** (sequential, after all): `interview-prep` — synthesizes everything + resume

Each step in `src/lib/research/steps/` follows the same pattern: Tavily search → format results → `generateStructured()` with a Zod schema.

### Key Files
| File | Purpose |
|------|---------|
| `src/lib/research/types.ts` | All Zod schemas + `ResearchReport` type — source of truth for data shapes |
| `src/lib/research/pipeline.ts` | Wave orchestration with `Promise.allSettled` for error isolation |
| `src/lib/ai/provider.ts` | `generateStructured()` wrapper around Vercel AI SDK + OpenAI |
| `src/lib/ai/prompts.ts` | All system prompts and per-step prompt builders |
| `src/lib/ai/perplexity.ts` | Perplexity client (used only for `recent-news` step) |
| `src/lib/search/client.ts` | Tavily wrapper + `companyQuery()` builder |
| `src/lib/rate-limit.ts` | In-memory rate limiting: 25/day global, 10/day per-IP |
| `src/hooks/use-research.ts` | SSE consumer; manages all client-side research state |
| `src/app/api/research/route.ts` | SSE endpoint; `maxDuration: 60` for Vercel |

### SSE Event Types
```
progress  → { step, status, message }
section   → { key, data }           (one per completed research step)
complete  → {}
error     → { message }
```

### Adding a New Research Step
1. Add Zod schema to `src/lib/research/types.ts`
2. Create step file in `src/lib/research/steps/`
3. Add system prompt + prompt builder to `src/lib/ai/prompts.ts`
4. Register in pipeline wave in `src/lib/research/pipeline.ts`
5. Add a section component in `src/components/report-sections/`
6. Wire section into `src/components/report-view.tsx`

## Design Decisions
- **In-memory rate limiting**: Zero-config for Vercel deploy; resets on cold start (not durable). Would need Redis for durability at scale.
- **GPT-4o only**: Cheaper models produced too many structured-output failures with complex nested Zod schemas.
- **`Promise.allSettled` in waves**: One step failure doesn't kill the stream — failed steps show an error state in the progress tracker.
- **Playwright port 3847**: Avoids conflicts with `npm run dev` on 3000; configured in `playwright.config.ts`.
