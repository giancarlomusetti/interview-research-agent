import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildCompanyOverviewPrompt } from "@/lib/ai/prompts";
import { search, companyQuery, formatSearchResults } from "@/lib/search/client";
import { CompanyOverviewSchema, type CompanyOverview, type ParsedJD } from "../types";

export async function researchCompanyOverview(jd: ParsedJD): Promise<CompanyOverview> {
  const results = await search(companyQuery(jd.companyName, jd.summary, "about overview company"));

  return generateStructured({
    system: SYSTEM_PROMPTS.companyOverview,
    prompt: buildCompanyOverviewPrompt(jd.companyName, jd.roleTitle, jd.summary, formatSearchResults(results)),
    schema: CompanyOverviewSchema,
    schemaName: "CompanyOverview",
  });
}
