import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildKeyPeoplePrompt } from "@/lib/ai/prompts";
import { search, companyQuery, formatSearchResults } from "@/lib/search/client";
import { KeyPeopleSchema, type KeyPeople, type ParsedJD } from "../types";

export async function researchKeyPeople(jd: ParsedJD): Promise<KeyPeople> {
  const results = await search(companyQuery(jd.companyName, jd.summary, "CEO founders leadership team"));

  return generateStructured({
    system: SYSTEM_PROMPTS.keyPeople,
    prompt: buildKeyPeoplePrompt(jd.companyName, jd.roleTitle, jd.department, jd.summary, formatSearchResults(results)),
    schema: KeyPeopleSchema,
    schemaName: "KeyPeople",
  });
}
