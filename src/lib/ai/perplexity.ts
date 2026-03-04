import Perplexity from "@perplexity-ai/perplexity_ai";
import { requireEnv } from "@/lib/env";

requireEnv("PERPLEXITY_API_KEY");
const client = new Perplexity();

export interface PerplexityNewsResult {
  content: string;
  citations: string[];
  searchResults: Array<{
    title: string;
    url: string;
    date?: string | null;
    snippet?: string;
  }>;
}

export type PerplexityFinancialsResult = PerplexityNewsResult;

export async function researchFinancials(
  companyName: string,
  companySummary: string
): Promise<PerplexityFinancialsResult> {
  const response = await client.chat.completions.create({
    model: "sonar-pro",
    messages: [
      {
        role: "system",
        content: `You are a financial analyst helping a job candidate understand a company's funding and financial health. Prioritize data from Crunchbase, PitchBook, SEC filings, and credible financial news. Cite specific figures with their sources. If a figure is not clearly stated in your sources, say "not found" — never estimate or construct totals by summing rounds unless a source explicitly states a cumulative figure.`,
      },
      {
        role: "user",
        content: `Find funding, valuation, and financial information about "${companyName}".\n\nCompany context: ${companySummary}\n\nIMPORTANT: Only include data clearly about THIS specific "${companyName}". Discard results about other companies with similar names.`,
      },
    ],
    search_recency_filter: "month",
    web_search_options: {
      search_context_size: "medium",
    },
  });

  const content = response.choices[0]?.message?.content;

  return {
    content: typeof content === "string" ? content : "",
    citations: response.citations ?? [],
    searchResults: (response.search_results ?? []).map((r) => ({
      title: r.title,
      url: r.url,
      date: r.date,
      snippet: r.snippet,
    })),
  };
}

export async function researchNews(
  companyName: string,
  roleTitle: string,
  jobDescription: string
): Promise<PerplexityNewsResult> {
  const response = await client.chat.completions.create({
    model: "sonar-pro",
    messages: [
      {
        role: "system",
        content: `You are a corporate news analyst helping a job candidate prepare for an interview. Find the most important recent news about the specified company. Focus on news that would be relevant in an interview: funding rounds, product launches, leadership changes, partnerships, acquisitions, earnings, strategic pivots, and industry developments. ONLY report real news with real sources — never fabricate.`,
      },
      {
        role: "user",
        content: `Find recent news about "${companyName}" for someone interviewing for the "${roleTitle}" role.\n\nHere is the full job description for context on what this company does:\n\n${jobDescription}\n\nIMPORTANT: Only include news clearly about THIS specific "${companyName}" company described in the job description above. Discard results about other companies with similar names.`,
      },
    ],
    search_recency_filter: "year",
    web_search_options: {
      search_context_size: "medium",
    },
  });

  const content = response.choices[0]?.message?.content;

  return {
    content: typeof content === "string" ? content : "",
    citations: response.citations ?? [],
    searchResults: (response.search_results ?? []).map((r) => ({
      title: r.title,
      url: r.url,
      date: r.date,
      snippet: r.snippet,
    })),
  };
}
