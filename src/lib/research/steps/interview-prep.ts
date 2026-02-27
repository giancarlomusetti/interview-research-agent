import { generateStructured } from "@/lib/ai/provider";
import { SYSTEM_PROMPTS, buildInterviewPrepPrompt } from "@/lib/ai/prompts";
import {
  InterviewPrepSchema,
  type InterviewPrep,
  type ResearchReport,
} from "../types";

export async function generateInterviewPrep(
  report: ResearchReport
): Promise<InterviewPrep> {
  return generateStructured({
    system: SYSTEM_PROMPTS.interviewPrep,
    prompt: buildInterviewPrepPrompt(
      JSON.stringify(report.parsedJD, null, 2),
      JSON.stringify(report.companyOverview ?? {}, null, 2),
      JSON.stringify(report.recentNews ?? {}, null, 2),
      JSON.stringify(report.financials ?? {}, null, 2),
      JSON.stringify(report.keyPeople ?? {}, null, 2),
      JSON.stringify(report.techAndProduct ?? {}, null, 2),
      JSON.stringify(report.cultureSentiment ?? {}, null, 2)
    ),
    schema: InterviewPrepSchema,
    schemaName: "InterviewPrep",
  });
}
