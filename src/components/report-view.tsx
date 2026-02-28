"use client";

import type { ResearchReport } from "@/lib/research/types";
import { JobAnalysis } from "./report-sections/job-analysis";
import { CultureSentimentSection } from "./report-sections/culture-sentiment";
import { LayoffsSection } from "./report-sections/layoffs";
import { RecentNewsSection } from "./report-sections/recent-news";
import { CompanySnapshotSection } from "./report-sections/company-snapshot";
import { TechAndProductSection } from "./report-sections/tech-and-product";
import { InterviewPrepSection } from "./report-sections/interview-prep";

interface ReportViewProps {
  report: Partial<ResearchReport>;
}

export function ReportView({ report }: ReportViewProps) {
  const hasSections =
    report.parsedJD ||
    report.companyOverview ||
    report.recentNews ||
    report.financials ||
    report.keyPeople ||
    report.techAndProduct ||
    report.cultureSentiment ||
    report.layoffs ||
    report.interviewPrep;

  if (!hasSections) return null;

  return (
    <div className="space-y-4">
      {/* 1. Role Summary */}
      {report.parsedJD && <JobAnalysis data={report.parsedJD} />}

      {/* 2. Culture & Sentiment (promoted — dealbreaker signal) */}
      {report.cultureSentiment && (
        <CultureSentimentSection data={report.cultureSentiment} />
      )}

      {/* 3. Layoffs & Stability (promoted — dealbreaker signal) */}
      {report.layoffs && <LayoffsSection data={report.layoffs} />}

      {/* 4. Recent News */}
      {report.recentNews && <RecentNewsSection data={report.recentNews} />}

      {/* 5. Company Snapshot (merged overview + financials) */}
      {report.companyOverview && (
        <CompanySnapshotSection
          companyOverview={report.companyOverview}
          financials={report.financials}
        />
      )}

      {/* 6. Tech Stack */}
      {report.techAndProduct && <TechAndProductSection data={report.techAndProduct} />}

      {/* 7. Interview Prep */}
      {report.interviewPrep && <InterviewPrepSection data={report.interviewPrep} />}
    </div>
  );
}
