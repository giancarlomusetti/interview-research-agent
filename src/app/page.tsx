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

  if (report.companyOverview) {
    const co = report.companyOverview;
    lines.push(`## Company Overview\n`);
    lines.push(co.description);
    if (co.industry) lines.push(`\n**Industry:** ${co.industry}`);
    if (co.founded) lines.push(`**Founded:** ${co.founded}`);
    if (co.headquarters) lines.push(`**HQ:** ${co.headquarters}`);
    if (co.employeeCount) lines.push(`**Employees:** ${co.employeeCount}`);
    if (co.mission) lines.push(`\n> ${co.mission}`);
    lines.push(`\n**Key Facts:**`);
    co.keyFacts.forEach((f) => lines.push(`- ${f}`));
    lines.push(...formatSources(co.sources));
    lines.push("");
  }

  if (report.recentNews) {
    lines.push(`## Recent News\n`);
    lines.push(`*${report.recentNews.overallNarrative}*\n`);
    report.recentNews.items.forEach((item) => {
      lines.push(`### ${item.headline}${item.date ? ` (${item.date})` : ""}`);
      lines.push(item.summary);
      lines.push(`**Relevance:** ${item.relevanceToRole}`);
      if (item.sourceUrl) lines.push(`[Source](${item.sourceUrl})`);
      lines.push("");
    });
  }

  if (report.financials) {
    const f = report.financials;
    lines.push(`## Funding & Financials\n`);
    lines.push(`**Status:** ${f.publicOrPrivate}`);
    if (f.totalFundingRaised) lines.push(`**Total Raised:** ${f.totalFundingRaised}`);
    if (f.lastFundingRound) lines.push(`**Last Round:** ${f.lastFundingRound}`);
    if (f.valuation) lines.push(`**Valuation:** ${f.valuation}`);
    if (f.keyInvestors?.length) lines.push(`**Key Investors:** ${f.keyInvestors.join(", ")}`);
    lines.push(`\n${f.financialHealth}`);
    lines.push(...formatSources(f.sources));
    lines.push("");
  }

  if (report.keyPeople) {
    lines.push(`## Key People\n`);
    report.keyPeople.people.forEach((p) => {
      lines.push(`- **${p.name}** — ${p.title}: ${p.background}`);
    });
    lines.push(`\n> **Interview Tip:** ${report.keyPeople.interviewTip}`);
    lines.push(...formatSources(report.keyPeople.sources));
    lines.push("");
  }

  if (report.techAndProduct) {
    const tp = report.techAndProduct;
    lines.push(`## Product & Tech Stack\n`);
    tp.products.forEach((p) => lines.push(`- **${p.name}:** ${p.description}`));
    if (tp.techStack?.length) lines.push(`\n**Tech Stack:** ${tp.techStack.join(", ")}`);
    if (tp.engineeringCulture) lines.push(`\n**Engineering Culture:** ${tp.engineeringCulture}`);
    lines.push(...formatSources(tp.sources));
    lines.push("");
  }

  if (report.cultureSentiment) {
    const cs = report.cultureSentiment;
    lines.push(`## Culture & Sentiment\n`);
    lines.push(`*${cs.overallSentiment}*\n`);
    if (cs.glassdoorRating) lines.push(`**Glassdoor Rating:** ${cs.glassdoorRating}`);
    lines.push(`\n**Positives:**`);
    cs.positives.forEach((p) => lines.push(`- ${p}`));
    lines.push(`\n**Criticisms:**`);
    cs.negatives.forEach((n) => lines.push(`- ${n}`));
    lines.push(...formatSources(cs.sources));
    lines.push("");
  }

  if (report.layoffs) {
    const lo = report.layoffs;
    lines.push(`## Layoffs & Restructuring\n`);
    if (!lo.hasLayoffs) {
      lines.push(`No significant layoffs or restructuring events found.\n`);
    } else {
      lo.events.forEach((event) => {
        lines.push(`### ${event.description}${event.date ? ` (${event.date})` : ""}`);
        if (event.affectedCount) lines.push(`**Affected:** ${event.affectedCount}`);
        if (event.approach) lines.push(`**Approach:** ${event.approach}`);
        if (event.sourceUrl) lines.push(`[Source](${event.sourceUrl})`);
        lines.push("");
      });
      lines.push(`**Overall Approach:** ${lo.overallApproach}`);
      lines.push(`**Public Sentiment:** ${lo.sentiment}\n`);
    }
  }

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
