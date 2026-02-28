import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildLayoffsPrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { LayoffsSchema, type Layoffs, type ParsedJD } from "../types";

export async function researchLayoffs(jd: ParsedJD): Promise<Layoffs> {
  const results = await search(
    `${jd.companyName} layoffs restructuring workforce reduction`
  );

  return generateStructured({
    system: SYSTEM_PROMPTS.layoffs,
    prompt: buildLayoffsPrompt(jd.companyName, formatSearchResults(results)),
    schema: LayoffsSchema,
    schemaName: "Layoffs",
  });
}
