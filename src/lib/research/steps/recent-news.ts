import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { researchNews } from "@/lib/ai/perplexity";
import type { RecentNews, ParsedJD } from "../types";

// GPT-4o only writes summary + relevanceToRole per article.
// headline, date, and sourceUrl come directly from Perplexity's searchResults —
// URL is never passed through an LLM, eliminating hallucination and matching errors.
const InternalNewsItemSchema = z.object({
  sourceIndex: z
    .number()
    .int()
    .describe("1-based index matching the article number in the prompt"),
  summary: z.string().describe("2-3 sentence summary of the article"),
  relevanceToRole: z.string().describe("Why this matters for your interview"),
});

const InternalRecentNewsSchema = z.object({
  items: z.array(InternalNewsItemSchema).describe("One entry per article provided"),
  overallNarrative: z
    .string()
    .describe(
      "1-2 sentences: what the news collectively says about the company direction"
    ),
});

export async function researchRecentNews(jd: ParsedJD, rawJD: string): Promise<RecentNews> {
  const perplexityResult = await researchNews(
    jd.companyName,
    jd.roleTitle,
    rawJD
  );

  // Filter out generic aggregator domains — their URLs lead to generic company
  // pages, not actual articles
  const GENERIC_DOMAINS = [
    "zoominfo.com",
    "dnb.com",
    "hoovers.com",
    "manta.com",
    "similarweb.com",
    "craft.co",
  ];
  const linkableResults = perplexityResult.searchResults.filter((r) => {
    try {
      const hostname = new URL(r.url).hostname.replace("www.", "");
      return !GENERIC_DOMAINS.some((d) => hostname === d || hostname.endsWith("." + d));
    } catch {
      return false;
    }
  });

  if (linkableResults.length === 0) {
    return { items: [], overallNarrative: "" };
  }

  // Numbered article list — GPT-4o gets title + snippet for context,
  // we resolve title/date/url from linkableResults by sourceIndex in code
  const articleList = linkableResults
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.title}${r.snippet ? `\n    Snippet: ${r.snippet}` : ""}`
    )
    .join("\n\n");

  const internal = await generateStructured({
    system: `You are a news analyst helping a job candidate prepare for an interview. For each article provided, write a concise summary and explain why it matters for the candidate's role. Use only information present in the article titles and snippets — do not fabricate details.`,
    prompt: `Write a summary and interview relevance note for each article about "${jd.companyName}" below. The candidate is interviewing for "${jd.roleTitle}".\n\nArticles:\n${articleList}\n\nContext from research:\n${perplexityResult.content}`,
    schema: InternalRecentNewsSchema,
    schemaName: "RecentNews",
  });

  return {
    overallNarrative: internal.overallNarrative,
    items: internal.items
      .map((item) => {
        const source = linkableResults[item.sourceIndex - 1];
        if (!source) return null;
        return {
          headline: source.title,
          date: source.date ?? null,
          summary: item.summary,
          relevanceToRole: item.relevanceToRole,
          sourceUrl: source.url, // pre-coupled by Perplexity, never touched by LLM
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  };
}
