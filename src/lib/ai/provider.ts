import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { requireEnv } from "@/lib/env";

requireEnv("OPENAI_API_KEY");
const model = openai(process.env.OPENAI_MODEL ?? "gpt-4o");

export async function generateStructured<T>(options: {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  schemaName: string;
}): Promise<T> {
  const { object } = await generateObject({
    model,
    system: options.system,
    prompt: options.prompt,
    schema: options.schema,
    schemaName: options.schemaName,
  });

  return object;
}
