"use client";

import type { ResearchReport } from "@/lib/research/types";
import { JobAnalysis } from "./report-sections/job-analysis";
import { CompanyOverviewSection } from "./report-sections/company-overview";
import { RecentNewsSection } from "./report-sections/recent-news";
import { FinancialsSection } from "./report-sections/financials";
import { KeyPeopleSection } from "./report-sections/key-people";
import { TechAndProductSection } from "./report-sections/tech-and-product";
import { CultureSentimentSection } from "./report-sections/culture-sentiment";
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
    report.interviewPrep;

  if (!hasSections) return null;

  return (
    <div className="space-y-4">
      {report.parsedJD && <JobAnalysis data={report.parsedJD} />}
      {report.companyOverview && <CompanyOverviewSection data={report.companyOverview} />}

      {(report.recentNews || report.financials) && (
        <div className="grid lg:grid-cols-2 gap-4">
          {report.recentNews && <RecentNewsSection data={report.recentNews} />}
          {report.financials && <FinancialsSection data={report.financials} />}
        </div>
      )}

      {report.keyPeople && <KeyPeopleSection data={report.keyPeople} />}
      {report.techAndProduct && <TechAndProductSection data={report.techAndProduct} />}
      {report.cultureSentiment && <CultureSentimentSection data={report.cultureSentiment} />}
      {report.interviewPrep && <InterviewPrepSection data={report.interviewPrep} />}
    </div>
  );
}
