import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildTechAndProductPrompt } from "@/lib/ai/prompts";
import { search, formatSearchResults } from "@/lib/search/client";
import { TechAndProductSchema, type TechAndProduct, type ParsedJD } from "../types";

export async function researchTechAndProduct(jd: ParsedJD): Promise<TechAndProduct> {
  const [productResults, techResults] = await Promise.all([
    search(`${jd.companyName} products services`),
    search(`${jd.companyName} tech stack engineering technology`),
  ]);

  const combined = formatSearchResults([...productResults, ...techResults]);

  return generateStructured({
    system: SYSTEM_PROMPTS.techAndProduct,
    prompt: buildTechAndProductPrompt(jd.companyName, jd.roleTitle, combined),
    schema: TechAndProductSchema,
    schemaName: "TechAndProduct",
  });
}
