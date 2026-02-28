import Perplexity from "@perplexity-ai/perplexity_ai";

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

  console.log("[perplexity] === REQUEST ===");
  console.log("[perplexity] companyName:", companyName);
  console.log("[perplexity] roleTitle:", roleTitle);
  console.log("[perplexity] jobDescription length:", jobDescription.length);
  console.log("[perplexity] === RESPONSE ===");
  console.log("[perplexity] content length:", typeof content === "string" ? content.length : 0);
  console.log("[perplexity] content preview:", typeof content === "string" ? content.slice(0, 500) : "(non-string)");
  console.log("[perplexity] citations:", JSON.stringify(response.citations));
  console.log("[perplexity] search_results count:", response.search_results?.length ?? 0);
  console.log("[perplexity] search_results:", JSON.stringify(response.search_results?.map(r => ({ title: r.title, url: r.url })) ?? []));

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
