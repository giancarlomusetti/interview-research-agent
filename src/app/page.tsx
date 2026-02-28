"use client";

import { useState } from "react";
import { useResearch } from "@/hooks/use-research";
import { SearchForm } from "@/components/search-form";
import { ResearchProgress } from "@/components/research-progress";
import { ReportView } from "@/components/report-view";
import { Button } from "@/components/ui/button";
import type { ResearchReport } from "@/lib/research/types";

function formatSources(sources: Array<{ title: string; url: string }> | null | undefined): string[] {
  if (!sources || sources.length === 0) return [];
  return ["", "**Sources:**", ...sources.map((s) => `- [${s.title}](${s.url})`)];
}

function reportToMarkdown(report: Partial<ResearchReport>): string {
  const lines: string[] = [];

  // 1. Role Summary
  if (report.parsedJD) {
    const jd = report.parsedJD;
    lines.push(`# Interview Research: ${jd.roleTitle} at ${jd.companyName}\n`);
    lines.push(`**Seniority:** ${jd.seniorityLevel}`);
    if (jd.department) lines.push(`**Department:** ${jd.department}`);
    if (jd.location) lines.push(`**Location:** ${jd.location}`);
    if (jd.salaryRange) lines.push(`**Compensation:** ${jd.salaryRange}`);
    lines.push(`\n${jd.summary}\n`);
    lines.push(`**Required Skills:** ${jd.requiredSkills.join(", ")}\n`);
    lines.push(`**Responsibilities:**`);
    jd.responsibilities.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }

  // 2. Culture & Sentiment (promoted)
  if (report.cultureSentiment) {
    const cs = report.cultureSentiment;
    lines.push(`## Culture & Sentiment\n`);
    lines.push(`**${cs.sentimentHeadline}**\n`);
    lines.push(`*${cs.overallSentiment}*\n`);
    if (cs.glassdoorRating) lines.push(`**Glassdoor Rating:** ${cs.glassdoorRating}`);
    lines.push(`\n**Positives:**`);
    cs.positives.forEach((p) => lines.push(`- ${p}`));
    lines.push(`\n**Criticisms:**`);
    cs.negatives.forEach((n) => lines.push(`- ${n}`));
    if (cs.seniorReality) lines.push(`\n**Senior-Level Reality:** ${cs.seniorReality}`);
    lines.push(...formatSources(cs.sources));
    lines.push("");
  }

  // 3. Layoffs & Stability (promoted)
  if (report.layoffs) {
    const lo = report.layoffs;
    lines.push(`## Layoffs & Stability\n`);
    if (!lo.hasLayoffs) {
      lines.push(`No significant layoffs or restructuring events found.\n`);
    } else {
      lines.push(`**Signal:** ${lo.signalInterpretation}\n`);
      lo.events.forEach((event) => {
        const datePart = event.date ?? "Unknown date";
        const countPart = event.affectedCount ? `${event.affectedCount} — ` : "";
        lines.push(`- **${datePart}:** ${countPart}${event.description}`);
        if (event.approach) lines.push(`  - Approach: ${event.approach}`);
      });
      lines.push(`\n**Overall Approach:** ${lo.overallApproach}`);
      lines.push(`**Public Sentiment:** ${lo.sentiment}`);
      if (lo.suggestedQuestion) lines.push(`\n> **Question to Ask:** "${lo.suggestedQuestion}"`);
      lines.push("");
    }
  }

  // 4. News
  if (report.recentNews) {
    lines.push(`## News\n`);
    lines.push(`*${report.recentNews.overallNarrative}*\n`);
    report.recentNews.items.forEach((item) => {
      lines.push(`### ${item.headline}${item.date ? ` (${item.date})` : ""}`);
      lines.push(item.summary);
      lines.push(`**Relevance:** ${item.relevanceToRole}`);
      if (item.sourceUrl) lines.push(`[Source](${item.sourceUrl})`);
      lines.push("");
    });
  }

  // 5. Company Snapshot (merged overview + financials)
  if (report.companyOverview) {
    const co = report.companyOverview;
    lines.push(`## Company Snapshot\n`);
    lines.push(co.noBSSummary);
    // Key numbers
    const stats: string[] = [];
    if (co.employeeCount) stats.push(`**Employees:** ${co.employeeCount}`);
    if (co.founded) stats.push(`**Founded:** ${co.founded}`);
    if (report.financials) {
      const f = report.financials;
      stats.push(`**Status:** ${f.publicOrPrivate}`);
      if (f.valuation) stats.push(`**Valuation:** ${f.valuation}`);
      if (f.totalFundingRaised) stats.push(`**Total Raised:** ${f.totalFundingRaised}`);
      if (f.lastFundingRound) stats.push(`**Last Round:** ${f.lastFundingRound}`);
    }
    if (stats.length > 0) lines.push(`\n${stats.join(" | ")}`);
    if (report.financials?.financialHealth) lines.push(`\n**Financial health:** ${report.financials.financialHealth}`);
    if (report.financials?.keyInvestors?.length) lines.push(`**Investors:** ${report.financials.keyInvestors.join(", ")}`);
    lines.push(`\n**Key Facts:**`);
    co.keyFacts.forEach((f) => lines.push(`- ${f}`));
    lines.push(...formatSources(co.sources));
    if (report.financials) lines.push(...formatSources(report.financials.sources));
    lines.push("");
  }

  // 6. Product & Tech Stack
  if (report.techAndProduct) {
    const tp = report.techAndProduct;
    lines.push(`## Product & Tech Stack\n`);
    tp.products.forEach((p) => lines.push(`- **${p.name}:** ${p.description}`));
    if (tp.techStack?.length) lines.push(`\n**Tech Stack:** ${tp.techStack.join(", ")}`);
    if (tp.engineeringCulture) lines.push(`\n**Engineering Culture:** ${tp.engineeringCulture}`);
    lines.push(...formatSources(tp.sources));
    lines.push("");
  }

  // 7. Interview Preparation
  if (report.interviewPrep) {
    const ip = report.interviewPrep;
    lines.push(`## Interview Preparation\n`);
    lines.push(`**Strategy:** ${ip.overallStrategy}\n`);
    lines.push(`### Questions They'll Ask You\n`);
    ip.questionsTheyWillAsk.forEach((q, i) => {
      lines.push(`${i + 1}. **${q.question}** [${q.category}]`);
      lines.push(`   - Why: ${q.whyTheyAsk}`);
      lines.push(`   - Approach: ${q.suggestedApproach}\n`);
    });
    lines.push(`### Questions You Should Ask\n`);
    ip.questionsYouShouldAsk.forEach((q, i) => {
      lines.push(`${i + 1}. **${q.question}**`);
      lines.push(`   - ${q.rationale}\n`);
    });
    lines.push(`### Key Talking Points\n`);
    ip.keyTalkingPoints.forEach((tp) => {
      lines.push(`- **${tp.point}** — ${tp.context}`);
    });
  }

  return lines.join("\n");
}

export default function Home() {
  const { state, steps, report, error, startResearch, reset } = useResearch();
  const [copied, setCopied] = useState(false);
  const isLoading = state === "loading";

  async function handleCopyMarkdown() {
    const md = reportToMarkdown(report);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Interview Research Agent
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Paste a job description and get a comprehensive, role-aware research
          briefing with tailored interview prep.
        </p>
      </div>

      {/* Search Form */}
      {state === "idle" || state === "error" ? (
        <div className="mb-8">
          <SearchForm onSubmit={startResearch} disabled={false} />
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      ) : null}

      {/* Loading state: form disabled + progress */}
      {isLoading && (
        <div className="space-y-6 mb-8">
          <SearchForm onSubmit={() => {}} disabled={true} />
          <ResearchProgress steps={steps} />
        </div>
      )}

      {/* Complete state: action buttons */}
      {state === "complete" && (
        <div className="flex gap-3 mb-6 animate-in fade-in duration-500">
          <Button onClick={handleCopyMarkdown} variant="outline" size="sm">
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? "Copied!" : "Copy as Markdown"}
          </Button>
          <Button onClick={reset} variant="outline" size="sm">
            New Research
          </Button>
        </div>
      )}

      {/* Report */}
      <ReportView report={report} />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>
          Built with Next.js, OpenAI, and Tavily. Research is AI-generated
          and may contain inaccuracies.
        </p>
      </footer>
    </main>
  );
}
