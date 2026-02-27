import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildParseJDPrompt } from "@/lib/ai/prompts";
import { ParsedJDSchema, type ParsedJD } from "../types";

export async function parseJobDescription(jobDescription: string): Promise<ParsedJD> {
  return generateStructured({
    system: SYSTEM_PROMPTS.parseJD,
    prompt: buildParseJDPrompt(jobDescription),
    schema: ParsedJDSchema,
    schemaName: "ParsedJobDescription",
  });
}
