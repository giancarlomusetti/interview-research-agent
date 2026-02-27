import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildCompanyOverviewPrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { CompanyOverviewSchema, type CompanyOverview, type ParsedJD } from "../types";

export async function researchCompanyOverview(jd: ParsedJD): Promise<CompanyOverview> {
  const results = await search(`${jd.companyName} about overview company`);

  return generateStructured({
    system: SYSTEM_PROMPTS.companyOverview,
    prompt: buildCompanyOverviewPrompt(jd.companyName, jd.roleTitle, formatSearchResults(results)),
    schema: CompanyOverviewSchema,
    schemaName: "CompanyOverview",
  });
}
