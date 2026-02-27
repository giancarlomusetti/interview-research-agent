import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildCulturePrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { CultureSentimentSchema, type CultureSentiment, type ParsedJD } from "../types";

export async function researchCulture(jd: ParsedJD): Promise<CultureSentiment> {
  const [reviewResults, valuesResults] = await Promise.all([
    search(`${jd.companyName} Glassdoor reviews culture work environment`),
    search(`${jd.companyName} company values remote work policy`),
  ]);

  const combined = formatSearchResults([...reviewResults, ...valuesResults]);

  return generateStructured({
    system: SYSTEM_PROMPTS.culture,
    prompt: buildCulturePrompt(jd.companyName, combined),
    schema: CultureSentimentSchema,
    schemaName: "CultureSentiment",
  });
}
