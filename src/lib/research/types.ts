import { z } from "zod";

// Step 0: Parsed Job Description
export const ParsedJDSchema = z.object({
  companyName: z.string().describe("Company name extracted from the job description"),
  roleTitle: z.string().describe("Job title / role name"),
  department: z.string().nullable().describe("Team or department if mentioned"),
  seniorityLevel: z.string().describe("e.g. Junior, Mid, Senior, Staff, Lead, Director"),
  requiredSkills: z.array(z.string()).describe("Technical and non-technical skills required"),
  responsibilities: z.array(z.string()).describe("Key job responsibilities"),
  niceToHaveSkills: z.array(z.string()).nullable().describe("Preferred but not required skills"),
  location: z.string().nullable().describe("Job location or remote status"),
  salaryRange: z.string().nullable().describe("Compensation info if mentioned"),
  summary: z.string().describe("2-3 sentence summary of the role"),
});
export type ParsedJD = z.infer<typeof ParsedJDSchema>;

// Reusable source link schema
export const SourceLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
});

// Step 1: Company Overview
export const CompanyOverviewSchema = z.object({
  name: z.string(),
  noBSSummary: z.string().describe("2-3 sentence no-bullshit summary of what the company does, what problem they solve, and why it matters. Be specific about the market, traction, and product-market fit. Example: 'SQUIRE solves barbershop chaos: walk-in vs appointment conflicts, chair rental disputes, per-barber payouts, client retention. $2B+ payments processed = proven PMF in $5B fragmented industry.'"),
  description: z.string().describe("1-2 paragraph company description"),
  founded: z.string().nullable(),
  headquarters: z.string().nullable(),
  employeeCount: z.string().nullable().describe("Approximate employee count or range"),
  industry: z.string(),
  mission: z.string().nullable().describe("Company mission or vision statement"),
  website: z.string().nullable(),
  keyFacts: z.array(z.string()).describe("3-5 notable facts about the company"),
  sources: z.array(SourceLinkSchema).nullable().describe("Source URLs used for this section"),
});
export type CompanyOverview = z.infer<typeof CompanyOverviewSchema>;

// Step 2: Recent News
export const NewsItemSchema = z.object({
  headline: z.string(),
  date: z.string().nullable(),
  summary: z.string().describe("2-3 sentence summary"),
  relevanceToRole: z.string().describe("Why this matters for your interview"),
  sourceUrl: z.string().nullable(),
});
export const RecentNewsSchema = z.object({
  items: z.array(NewsItemSchema).describe("Top 5 recent news items"),
  overallNarrative: z.string().describe("1-2 sentences: what the news collectively says about the company direction"),
});
export type RecentNews = z.infer<typeof RecentNewsSchema>;

// Step 3: Funding & Financials
export const FinancialsSchema = z.object({
  publicOrPrivate: z.string().describe("Public (with ticker) or Private"),
  totalFundingRaised: z.string().nullable(),
  lastFundingRound: z.string().nullable().describe("e.g. Series C, $150M, Jan 2025"),
  keyInvestors: z.array(z.string()).nullable(),
  valuation: z.string().nullable(),
  revenueInfo: z.string().nullable().describe("Any known revenue figures or growth metrics"),
  financialHealth: z.string().describe("Brief assessment of financial trajectory"),
  sources: z.array(SourceLinkSchema).nullable().describe("Source URLs used for this section"),
});
export type Financials = z.infer<typeof FinancialsSchema>;

// Step 4: Key People
export const PersonSchema = z.object({
  name: z.string(),
  title: z.string(),
  background: z.string().describe("1-2 sentences about their background"),
  notableInfo: z.string().nullable().describe("Interesting fact relevant to a candidate"),
});
export const KeyPeopleSchema = z.object({
  people: z.array(PersonSchema).describe("Up to 6 key people"),
  interviewTip: z.string().describe("How to leverage this info in your interview"),
  sources: z.array(SourceLinkSchema).nullable().describe("Source URLs used for this section"),
});
export type KeyPeople = z.infer<typeof KeyPeopleSchema>;

// Step 5: Product & Tech
export const TechAndProductSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe("Main products or services"),
  techStack: z.array(z.string()).nullable().describe("Known technologies used"),
  engineeringCulture: z.string().nullable().describe("Engineering practices, blog posts, open source"),
  recentLaunches: z.array(z.string()).nullable().describe("Recent product launches or features"),
  relevanceToRole: z.string().describe("How the tech/product landscape connects to this specific role"),
  sources: z.array(SourceLinkSchema).nullable().describe("Source URLs used for this section"),
});
export type TechAndProduct = z.infer<typeof TechAndProductSchema>;

// Step 6: Culture & Sentiment
export const CultureSentimentSchema = z.object({
  sentimentHeadline: z.string().describe("Bold 3-5 word headline like 'HIGH OWNERSHIP, HIGH PRESSURE' or 'COLLABORATIVE BUT SLOW-MOVING'"),
  glassdoorRating: z.string().nullable().describe("Overall rating if found"),
  positives: z.array(z.string()).describe("What employees like"),
  negatives: z.array(z.string()).describe("Common criticisms"),
  seniorReality: z.string().nullable().describe("What the culture specifically means for senior/staff-level candidates — e.g. 'Expect to own entire subsystems with minimal direction'"),
  companyValues: z.array(z.string()).nullable().describe("Stated company values"),
  remotePolicy: z.string().nullable(),
  interviewProcess: z.string().nullable().describe("What candidates report about the interview process"),
  overallSentiment: z.string().describe("1-2 sentence summary of employee sentiment"),
  suggestedInterviewFraming: z.string().nullable().describe("How to frame culture-fit answers — e.g. 'Emphasize autonomy and bias-for-action over process-heavy examples'"),
  sources: z.array(SourceLinkSchema).nullable().describe("Source URLs used for this section"),
});
export type CultureSentiment = z.infer<typeof CultureSentimentSchema>;

// Step 7: Layoffs & Restructuring
export const LayoffEventSchema = z.object({
  date: z.string().nullable(),
  affectedCount: z.string().nullable().describe("Number or percentage affected"),
  description: z.string(),
  approach: z.string().nullable().describe("Severance, voluntary, criticism, etc."),
  sourceUrl: z.string().nullable(),
});
export const LayoffsSchema = z.object({
  hasLayoffs: z.boolean().describe("Whether the company has had notable layoffs"),
  events: z.array(LayoffEventSchema).describe("Individual layoff events"),
  overallApproach: z.string().describe("Summary of how the company handles layoffs"),
  sentiment: z.string().describe("Public/employee reaction to layoffs"),
  signalInterpretation: z.string().describe("Whether layoffs signal distress (revenue decline, failed product) or discipline (post-acquisition restructuring, strategic pivot). Use language like 'DISTRESS SIGNAL' or 'STRATEGIC DISCIPLINE'"),
  suggestedQuestion: z.string().nullable().describe("A tactful question the candidate could ask about stability — e.g. 'How has the team's scope evolved since the recent restructuring?'"),
});
export type Layoffs = z.infer<typeof LayoffsSchema>;

// Step 8: Interview Prep
export const InterviewQuestionSchema = z.object({
  question: z.string(),
  category: z.string().describe("technical, behavioral, company-specific, or role-specific"),
  whyTheyAsk: z.string().describe("Why this question is likely and what they're looking for"),
  suggestedApproach: z.string().describe("How to structure your answer"),
});
export const CandidateQuestionSchema = z.object({
  question: z.string(),
  rationale: z.string().describe("Why asking this shows you did your research"),
});
export const TalkingPointSchema = z.object({
  point: z.string(),
  context: z.string().describe("Which JD requirement this addresses and supporting research"),
});
export const InterviewPrepSchema = z.object({
  questionsTheyWillAsk: z.array(InterviewQuestionSchema).describe("8 likely interview questions"),
  questionsYouShouldAsk: z.array(CandidateQuestionSchema).describe("5 smart questions to ask"),
  keyTalkingPoints: z.array(TalkingPointSchema).describe("5-6 succinct talking points"),
  overallStrategy: z.string().describe("2-3 sentence interview strategy recommendation"),
});
export type InterviewPrep = z.infer<typeof InterviewPrepSchema>;

// Full Research Report
export interface ResearchReport {
  parsedJD: ParsedJD;
  companyOverview?: CompanyOverview;
  recentNews?: RecentNews;
  financials?: Financials;
  keyPeople?: KeyPeople;
  techAndProduct?: TechAndProduct;
  cultureSentiment?: CultureSentiment;
  layoffs?: Layoffs;
  interviewPrep?: InterviewPrep;
}

// Pipeline event types for SSE streaming
export type StepStatus = "pending" | "running" | "completed" | "error";

export interface StepInfo {
  id: string;
  label: string;
  status: StepStatus;
}

export type PipelineEvent =
  | { type: "progress"; steps: StepInfo[] }
  | { type: "section"; sectionId: string; data: unknown }
  | { type: "complete"; report: ResearchReport }
  | { type: "error"; message: string };
