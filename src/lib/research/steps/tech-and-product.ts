import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildTechAndProductPrompt } from "@/lib/ai/prompts";
import { search, companyQuery, formatSearchResults } from "@/lib/search/client";
import { TechAndProductSchema, type TechAndProduct, type ParsedJD } from "../types";

export async function researchTechAndProduct(jd: ParsedJD): Promise<TechAndProduct> {
  const [productResults, techResults] = await Promise.all([
    search(companyQuery(jd.companyName, jd.summary, "products services")),
    search(companyQuery(jd.companyName, jd.summary, "tech stack engineering technology")),
  ]);

  const combined = formatSearchResults([...productResults, ...techResults]);

  return generateStructured({
    system: SYSTEM_PROMPTS.techAndProduct,
    prompt: buildTechAndProductPrompt(jd.companyName, jd.roleTitle, jd.summary, combined),
    schema: TechAndProductSchema,
    schemaName: "TechAndProduct",
  });
}
