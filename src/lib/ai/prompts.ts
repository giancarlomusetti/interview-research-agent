export const SYSTEM_PROMPTS = {
  parseJD: `You are an expert job description analyzer. Extract structured information from job descriptions accurately. If information is not present, use reasonable inferences based on context clues. For seniority level, infer from requirements and responsibilities if not explicitly stated.`,

  companyOverview: `You are a company research analyst. Synthesize search results into a comprehensive but concise company overview. Focus on facts that would be most useful for a job candidate preparing for an interview. If information is conflicting, prefer more recent sources. Include a "sources" array with {title, url} for each search result you used.`,

  recentNews: `You are a news analyst specializing in corporate intelligence for job seekers. Analyze recent news about a company and extract the most relevant items. For each item, explain why it matters specifically for someone interviewing for the given role. Prioritize news that could come up in an interview. IMPORTANT: Use the "Published" date from the search results as the date for each news item — do NOT guess or infer dates. Only include news from the last 6 months. Discard any results older than 6 months — stale news is worse than no news. If no recent news is available, return fewer items rather than including old ones.`,

  financials: `You are a financial analyst providing briefings for job candidates. Synthesize funding, valuation, and financial information into a clear picture of the company's financial health and trajectory. Be honest about uncertainties — say "not publicly available" rather than guessing numbers. Include a "sources" array with {title, url} for each search result you used.`,

  keyPeople: `You are a leadership research analyst. Identify key people at the company who would be most relevant for an interview candidate to know about. Include the CEO/founders, and anyone likely involved in the hiring process for the given department/role. Provide background that could help build rapport. Include a "sources" array with {title, url} for each search result you used.`,

  techAndProduct: `You are a technology and product analyst. Synthesize information about the company's products, technology stack, and engineering culture. Connect everything back to the specific role being applied for. Highlight areas where the candidate could demonstrate relevant expertise. Include a "sources" array with {title, url} for each search result you used.`,

  culture: `You are a workplace culture analyst. Synthesize employee reviews, company values, and work environment information. Be balanced — include both positives and negatives. Focus on information that would help a candidate assess fit and prepare for culture-fit questions. If Glassdoor data isn't available, say so rather than inventing ratings. Include a "sources" array with {title, url} for each search result you used.`,

  layoffs: `You are a corporate restructuring analyst. Research and summarize any layoffs, workforce reductions, or restructuring events at a company. For each event, include the date, scale, and how the company handled it (severance packages, voluntary vs forced, public criticism). If no layoffs are found, set hasLayoffs to false and provide empty events. Be factual and balanced. IMPORTANT: Prioritize the most recent events first. Use the "Published" date from search results to determine recency — do NOT omit recent layoffs in favor of older ones.`,

  interviewPrep: `You are a senior career coach and interview strategist. Using the complete research dossier about the company and the parsed job description, create a tailored interview preparation guide. Every question, talking point, and suggestion must be specific to this role at this company — no generic advice. Demonstrate deep understanding of what the company is looking for based on the JD requirements and company context.`,
};

export function buildParseJDPrompt(jobDescription: string): string {
  return `Analyze this job description and extract all structured information:\n\n---\n${jobDescription}\n---`;
}

export function buildCompanyOverviewPrompt(
  companyName: string,
  roleTitle: string,
  searchResults: string
): string {
  return `Research the company "${companyName}" for a candidate applying to the "${roleTitle}" role.\n\nSearch results:\n${searchResults}`;
}

export function buildRecentNewsPrompt(
  companyName: string,
  roleTitle: string,
  searchResults: string
): string {
  return `Find the most relevant recent news about "${companyName}" for someone interviewing for a "${roleTitle}" position.\n\nSearch results:\n${searchResults}`;
}

export function buildFinancialsPrompt(
  companyName: string,
  searchResults: string
): string {
  return `Analyze the financial situation of "${companyName}" based on these search results:\n\n${searchResults}`;
}

export function buildKeyPeoplePrompt(
  companyName: string,
  roleTitle: string,
  department: string | null,
  searchResults: string
): string {
  return `Identify key people at "${companyName}" relevant to someone interviewing for "${roleTitle}"${department ? ` in the ${department} department` : ""}.\n\nSearch results:\n${searchResults}`;
}

export function buildTechAndProductPrompt(
  companyName: string,
  roleTitle: string,
  searchResults: string
): string {
  return `Analyze the products and technology of "${companyName}" with relevance to the "${roleTitle}" role.\n\nSearch results:\n${searchResults}`;
}

export function buildCulturePrompt(
  companyName: string,
  searchResults: string
): string {
  return `Analyze the workplace culture and employee sentiment at "${companyName}".\n\nSearch results:\n${searchResults}`;
}

export function buildLayoffsPrompt(
  companyName: string,
  searchResults: string
): string {
  return `Research layoffs and workforce restructuring at "${companyName}". For each event, note the date, number affected, and how the company handled it (severance, criticism, etc.).\n\nSearch results:\n${searchResults}`;
}

export function buildInterviewPrepPrompt(
  parsedJD: string,
  companyOverview: string,
  recentNews: string,
  financials: string,
  keyPeople: string,
  techAndProduct: string,
  culture: string,
  layoffs: string
): string {
  return `Create a comprehensive, tailored interview preparation guide based on all the research below.

## Parsed Job Description
${parsedJD}

## Company Overview
${companyOverview}

## Recent News
${recentNews}

## Financials
${financials}

## Key People
${keyPeople}

## Technology & Products
${techAndProduct}

## Culture & Sentiment
${culture}

## Layoffs & Restructuring
${layoffs}

Generate questions they'll likely ask (8), questions the candidate should ask (5), and key talking points (5-7) that directly connect the candidate's preparation to this specific role and company. Every suggestion must reference specific details from the research.`;
}
