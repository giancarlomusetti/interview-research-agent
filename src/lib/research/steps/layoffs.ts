import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildLayoffsPrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { LayoffsSchema, type Layoffs, type ParsedJD } from "../types";

export async function researchLayoffs(jd: ParsedJD): Promise<Layoffs> {
  const [newsResults, generalResults] = await Promise.all([
    search(`${jd.companyName} layoffs`, {
      topic: "news",
      maxResults: 5,
      days: 365,
    }),
    search(`${jd.companyName} layoffs restructuring workforce reduction`),
  ]);

  const combined = formatSearchResults([...newsResults, ...generalResults]);

  return generateStructured({
    system: SYSTEM_PROMPTS.layoffs,
    prompt: buildLayoffsPrompt(jd.companyName, combined),
    schema: LayoffsSchema,
    schemaName: "Layoffs",
  });
}
