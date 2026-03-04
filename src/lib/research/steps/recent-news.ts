import { z } from "zod";
import { generateStructured } from "@/lib/ai/provider";
import { researchNews } from "@/lib/ai/perplexity";
import type { RecentNews, ParsedJD } from "../types";

// Internal schema: LLM picks sourceUrl verbatim from the source blocks we provide.
// _urlVerified is a self-check — if Claude marks false, we drop the URL rather than
// surface a confidently wrong link.
const InternalNewsItemSchema = z.object({
  headline: z.string(),
  date: z.string().nullable(),
  summary: z.string().describe("2-3 sentence summary"),
  relevanceToRole: z.string().describe("Why this matters for your interview"),
  sourceUrl: z
    .string()
    .nullable()
    .describe(
      "Copy the URL verbatim from the source references below that best supports this headline. Null if no source clearly matches."
    ),
  _urlVerified: z
    .boolean()
    .describe(
      "True only if the source title or snippet directly relates to this headline"
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

  // Filter out generic aggregator domains — preserve their context in the prose but
  // don't offer them as linkable sources (their URLs lead to generic company pages, not articles)
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

  // Build rich source blocks from linkable searchResults so Claude can match by content, not index
  const sourceBlocks = linkableResults
    .map(
      (r, i) =>
        `[SOURCE ${i + 1}]\nTitle: ${r.title}\nURL: ${r.url}${r.date ? `\nDate: ${r.date}` : ""}${r.snippet ? `\nSnippet: ${r.snippet}` : ""}`
    )
    .join("\n\n");

  // Fall back to flat citation list if no linkable searchResults are available
  const sourcesSection = sourceBlocks.trim()
    ? `Source references (copy URL verbatim into sourceUrl):\n\n${sourceBlocks}`
    : `Available citation URLs:\n${perplexityResult.citations.map((u) => `- ${u}`).join("\n")}`;

  const hasSources = linkableResults.length > 0 || perplexityResult.citations.length > 0;

  const system = hasSources
    ? `You are a news analyst. Extract structured news items from the provided research. For each item, set sourceUrl to the exact URL from the source references that best supports the headline — copy it verbatim, do NOT modify or construct URLs. Set _urlVerified to true only if the source title or snippet directly relates to the headline. NEVER fabricate news — only extract what is present in the research text. If the research contains no relevant news, return an empty items array.`
    : `You are a news analyst. Extract structured news items from the provided research. Set sourceUrl to null for ALL items — no source references are available, do NOT invent or guess URLs. Set _urlVerified to false for ALL items. NEVER fabricate news — only extract what is present in the research text. If the research contains no relevant news, return an empty items array.`;

  const prompt = hasSources
    ? `Extract the top news items about "${jd.companyName}" relevant to a "${jd.roleTitle}" candidate.\n\nResearch:\n${perplexityResult.content}\n\n${sourcesSection}`
    : `Extract the top news items about "${jd.companyName}" relevant to a "${jd.roleTitle}" candidate.\n\nResearch:\n${perplexityResult.content}`;

  const internal = await generateStructured({
    system,
    prompt,
    schema: InternalRecentNewsSchema,
    schemaName: "RecentNews",
  });

  return {
    overallNarrative: internal.overallNarrative,
    items: internal.items.map((item) => ({
      headline: item.headline,
      date: item.date,
      summary: item.summary,
      relevanceToRole: item.relevanceToRole,
      // Drop URL if no sources were available or Claude flagged it as unverified
      sourceUrl: hasSources && item._urlVerified ? (item.sourceUrl ?? null) : null,
    })),
  };
}
