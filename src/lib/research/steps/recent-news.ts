import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildRecentNewsPrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { RecentNewsSchema, type RecentNews, type ParsedJD } from "../types";

export async function researchRecentNews(jd: ParsedJD): Promise<RecentNews> {
  const results = await search(`${jd.companyName} latest news 2025 2026`, {
    topic: "news",
    maxResults: 8,
  });

  return generateStructured({
    system: SYSTEM_PROMPTS.recentNews,
    prompt: buildRecentNewsPrompt(jd.companyName, jd.roleTitle, formatSearchResults(results)),
    schema: RecentNewsSchema,
    schemaName: "RecentNews",
  });
}
