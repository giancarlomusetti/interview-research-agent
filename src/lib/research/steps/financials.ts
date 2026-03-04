import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildFinancialsPrompt } from "@/lib/ai/prompts";
import { researchFinancials as perplexityResearchFinancials } from "@/lib/ai/perplexity";
import { FinancialsSchema, type Financials, type ParsedJD } from "../types";

export async function researchFinancials(jd: ParsedJD): Promise<Financials> {
  const perplexityResult = await perplexityResearchFinancials(jd.companyName, jd.summary);

  const sourceBlocks = perplexityResult.searchResults
    .map(
      (r, i) =>
        `[SOURCE ${i + 1}]\nTitle: ${r.title}\nURL: ${r.url}${r.date ? `\nDate: ${r.date}` : ""}${r.snippet ? `\nSnippet: ${r.snippet}` : ""}`
    )
    .join("\n\n");

  const searchResults = [
    perplexityResult.content,
    sourceBlocks.trim() ? `\nSource references:\n\n${sourceBlocks}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return generateStructured({
    system: SYSTEM_PROMPTS.financials,
    prompt: buildFinancialsPrompt(jd.companyName, jd.summary, searchResults),
    schema: FinancialsSchema,
    schemaName: "Financials",
  });
}
