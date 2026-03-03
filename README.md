# Interview Research Agent

AI-powered interview preparation tool. Paste a job description and get a comprehensive, role-aware research briefing with tailored interview prep in ~20 seconds.

**[Try it live](https://interview-research-agent.vercel.app)** — no sign-up, no API keys needed. 10 free researches per day.

---

## Problem

Candidates preparing for interviews spend 2–4 hours manually googling the company, skimming Glassdoor, reading recent news, and piecing together talking points — only to end up with generic, surface-level prep that isn't tailored to the actual role.

There was no tool that automated deep company research *and* filtered it through the lens of a specific job description to produce role-aware interview prep.

## Solution

A Next.js app where you paste a job description and get a full research briefing in ~20 seconds.

The agent runs 9 steps across 3 parallel waves:

| Step | What It Does | API Used |
|---|---|---|
| Parse JD | Extracts company, role, skills, seniority | OpenAI GPT-4o |
| Company overview | Background, size, mission | Tavily + GPT-4o |
| Recent news | Latest developments with citations | Perplexity sonar-pro |
| Funding & financials | Runway, revenue signals, investors | Tavily + GPT-4o |
| Key people | Leadership bios and recent activity | Tavily + GPT-4o |
| Products & tech stack | What they build and how | Tavily + GPT-4o |
| Culture & sentiment | Glassdoor signals, employee reviews | Tavily + GPT-4o |
| Layoffs & signals | Restructuring, hiring freeze indicators | Tavily + GPT-4o |
| Interview prep | Questions they'll ask, questions to ask, talking points | OpenAI GPT-4o |

Results stream into the UI as each step completes via Server-Sent Events — no waiting for the full pipeline to finish.

## Tradeoffs

**In-memory rate limiting vs. Upstash Redis** — chose in-memory to keep the deploy zero-config. The tradeoff is limits reset on every cold start, so the 25/day global cap isn't fully durable. A Redis layer would fix this but adds infrastructure cost and complexity for a free tool.

**SSE streaming vs. simple polling** — streaming gives a much better perceived performance UX (results appear progressively) but required a more complex hook on the client and careful error handling on the server. Worth it for a research tool where the wait would otherwise feel opaque.

**OpenAI GPT-4o vs. cheaper models** — used GPT-4o for structured output quality. The `generateObject` + Zod schema approach needs a model that reliably follows complex JSON schemas. Cheaper models failed too often on multi-field nested outputs. Cost tradeoff is ~$0.05/research, acceptable at low volume.

**Tavily free tier constraint** — 1,000 searches/month caps the live version at ~80–100 researches/month. Scaling would require either a paid Tavily plan or caching results for popular companies.

## What I Learned

- **Parallel AI pipelines with SSE**: Orchestrating 9 LLM calls across 3 dependency waves while streaming results to a client forced me to think carefully about promise batching, error isolation (one failed step shouldn't kill the stream), and how SSE handles backpressure in Next.js Route Handlers.

- **Structured output with Zod**: Using `generateObject` with explicit Zod schemas instead of parsing free-text LLM output made the pipeline dramatically more reliable. Defining the schema first also clarified what each step actually needed to produce.

- **Role-aware prompting**: The key insight was passing the parsed job description as context into every downstream research step, not just the final synthesis. This is what makes the output feel tailored rather than generic — the model knows what to look for in each section relative to the role.

- **Perplexity for real-time data**: Learned the difference between retrieval-augmented generation (Tavily searches, then summarizes) vs. Perplexity's sonar model (searches + reasons natively). Perplexity is significantly better for news because it returns citations alongside synthesis, which matters for credibility in an interview prep context.

## What Makes a Good Research Session

1. **Paste the full job description** — the more context, the sharper the role-specific framing
2. **Use the "questions to ask them" section** — shows you've done homework interviewers rarely expect
3. **Read the tech stack section before a technical screen** — know what they're actually building
4. **Review talking points against your resume** — the agent maps your background to their priorities
5. **Re-run after major company news** — Perplexity pulls real-time results, so freshness matters

---

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript strict mode
- **Styling**: Tailwind CSS + shadcn/ui, dark theme
- **AI**: OpenAI GPT-4o via Vercel AI SDK (`generateObject` for structured output)
- **News**: Perplexity sonar-pro (real-time with citations)
- **Search**: Tavily API (free tier: 1,000 searches/month)
- **Deployment**: Vercel
- **Rate Limiting**: In-memory, 10/IP/day + 25 global/day

## Quick Start

```bash
git clone https://github.com/giancarlomusetti/interview-research-agent.git
cd interview-research-agent
npm install
cp .env.example .env.local  # add your API keys
npm run dev
```

**Required environment variables:**

| Variable | Where to get it |
|---|---|
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) — free tier available |
| `PERPLEXITY_API_KEY` | [docs.perplexity.ai](https://docs.perplexity.ai) |

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Import the repo, add the three environment variables, deploy.

## License

MIT — fork it, build on it, ship your own version.
