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
}

export async function search(
  query: string,
  options?: { topic?: "general" | "news"; maxResults?: number }
): Promise<SearchResult[]> {
  const response = await getClient().search(query, {
    topic: options?.topic ?? "general",
    maxResults: options?.maxResults ?? 5,
    includeAnswer: false,
  });

  return response.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

export function formatSearchResults(results: SearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}\n`
    )
    .join("\n---\n");
}
