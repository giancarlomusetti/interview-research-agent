import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { researchNews } from "@/lib/ai/perplexity";
import type { RecentNews, ParsedJD } from "../types";

// Internal schema: LLM maps each item to a citationIndex from Perplexity's citations[].
// We resolve the index to a real URL programmatically.
const InternalNewsItemSchema = z.object({
  headline: z.string(),
  date: z.string().nullable(),
  summary: z.string().describe("2-3 sentence summary"),
  relevanceToRole: z.string().describe("Why this matters for your interview"),
  citationIndex: z
    .number()
    .nullable()
    .describe(
      "The 0-based index into the citations list for this news item's source"
    ),
});

const InternalRecentNewsSchema = z.object({
  items: z.array(InternalNewsItemSchema).describe("Top 5 news items"),
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

  // Build a citation reference for the LLM to map items → URLs
  const citationList = perplexityResult.citations
    .map((url, i) => `[${i}] ${url}`)
    .join("\n");

  console.log("[recent-news] citationList sent to OpenAI:\n", citationList || "(empty)");
  console.log("[recent-news] perplexity content length:", perplexityResult.content.length);

  const internal = await generateStructured({
    system: `You are a news analyst. Extract structured news items from the provided research. For each item, set citationIndex to the 0-based index of the citation URL that sourced it. If no citation matches, set citationIndex to null. NEVER fabricate news — only extract what is present in the research text. If the research contains no relevant news, return an empty items array.`,
    prompt: `Extract the top news items about "${jd.companyName}" relevant to a "${jd.roleTitle}" candidate.\n\nResearch:\n${perplexityResult.content}\n\nAvailable citations:\n${citationList}`,
    schema: InternalRecentNewsSchema,
    schemaName: "RecentNews",
  });

  console.log("[recent-news] OpenAI extracted items:", internal.items.length);
  console.log("[recent-news] items:", JSON.stringify(internal.items.map(i => ({ headline: i.headline, citationIndex: i.citationIndex })), null, 2));

  // Map citationIndex → real URLs from Perplexity's citations[]
  return {
    overallNarrative: internal.overallNarrative,
    items: internal.items.map((item) => ({
      headline: item.headline,
      date: item.date,
      summary: item.summary,
      relevanceToRole: item.relevanceToRole,
      sourceUrl:
        item.citationIndex != null &&
        perplexityResult.citations[item.citationIndex]
          ? perplexityResult.citations[item.citationIndex]
          : null,
    })),
  };
}
