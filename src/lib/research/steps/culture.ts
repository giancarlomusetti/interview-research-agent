import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildCulturePrompt } from "@/lib/ai/prompts";
import { search, companyQuery, formatSearchResults } from "@/lib/search/client";
import { CultureSentimentSchema, type CultureSentiment, type ParsedJD } from "../types";

export async function researchCulture(jd: ParsedJD): Promise<CultureSentiment> {
  const [reviewResults, valuesResults] = await Promise.all([
    search(companyQuery(jd.companyName, jd.summary, "Glassdoor reviews culture work environment")),
    search(companyQuery(jd.companyName, jd.summary, "company values remote work policy")),
  ]);

  const combined = formatSearchResults([...reviewResults, ...valuesResults]);

  return generateStructured({
    system: SYSTEM_PROMPTS.culture,
    prompt: buildCulturePrompt(jd.companyName, combined, jd.roleTitle, jd.seniorityLevel),
    schema: CultureSentimentSchema,
    schemaName: "CultureSentiment",
  });
}
