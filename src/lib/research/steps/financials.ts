import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildFinancialsPrompt } from "@/lib/ai/prompts";
import { search, companyQuery, formatSearchResults } from "@/lib/search/client";
import { FinancialsSchema, type Financials, type ParsedJD } from "../types";

export async function researchFinancials(jd: ParsedJD): Promise<Financials> {
  const results = await search(companyQuery(jd.companyName, jd.summary, "funding valuation investors revenue"));

  return generateStructured({
    system: SYSTEM_PROMPTS.financials,
    prompt: buildFinancialsPrompt(jd.companyName, jd.summary, formatSearchResults(results)),
    schema: FinancialsSchema,
    schemaName: "Financials",
  });
}
