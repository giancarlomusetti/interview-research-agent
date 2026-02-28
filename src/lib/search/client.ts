import { tavily, type TavilyClient } from "@tavily/core";

let _client: TavilyClient | null = null;
function getClient() {
  if (!_client) {
    _client = tavily({ apiKey: process.env.TAVILY_API_KEY! });
  }
  return _client;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate: string | null;
}

export async function search(
  query: string,
  options?: { topic?: "general" | "news"; maxResults?: number; days?: number }
): Promise<SearchResult[]> {
  const searchOptions: Record<string, unknown> = {
    topic: options?.topic ?? "general",
    maxResults: options?.maxResults ?? 5,
    includeAnswer: false,
  };
  if (options?.days && options.topic === "news") {
    searchOptions.days = options.days;
  }
  const response = await getClient().search(query, searchOptions);

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
    publishedDate: r.publishedDate || null,
  }));
}

/**
 * Builds a disambiguated search query by adding a few context words from the JD summary.
 * Prevents Tavily from returning results about the wrong "Squire", "Bolt", etc.
 * Keeps the query short — search engines choke on full sentences.
 */
export function companyQuery(companyName: string, summary: string, ...keywords: string[]): string {
  // Extract a few disambiguating nouns from the summary (skip common filler words)
  const stopWords = new Set(["a", "an", "the", "is", "are", "at", "in", "on", "to", "for", "of", "and", "or", "with", "as", "by", "this", "that", "role", "position", "team", "join", "looking", "seeking", "will", "you", "we", "our", "their", "your", "be", "has", "have", "from", "about"]);
  const contextWords = summary
    .split(/[\s,.;:]+/)
    .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 2 && !stopWords.has(w) && w !== companyName.toLowerCase())
    .slice(0, 3)
    .join(" ");
  return `${companyName} ${keywords.join(" ")} ${contextWords}`;
}

export function formatSearchResults(results: SearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.url}${r.publishedDate ? `\nPublished: ${r.publishedDate}` : ""}\n${r.content}\n`
    )
    .join("\n---\n");
}
