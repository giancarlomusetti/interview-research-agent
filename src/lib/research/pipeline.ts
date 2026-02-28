import type { ResearchReport, StepInfo, PipelineEvent } from "./types";
import { parseJobDescription } from "./steps/parse-jd";
import { researchCompanyOverview } from "./steps/company-overview";
import { researchRecentNews } from "./steps/recent-news";
import { researchFinancials } from "./steps/financials";
import { researchKeyPeople } from "./steps/key-people";
import { researchTechAndProduct } from "./steps/tech-and-product";
import { researchCulture } from "./steps/culture";
import { researchLayoffs } from "./steps/layoffs";
import { generateInterviewPrep } from "./steps/interview-prep";

const STEPS: StepInfo[] = [
  { id: "parse-jd", label: "Analyzing Job Description", status: "pending" },
  { id: "company-overview", label: "Company Overview", status: "pending" },
  { id: "recent-news", label: "Recent News", status: "pending" },
  { id: "financials", label: "Funding & Financials", status: "pending" },
  { id: "key-people", label: "Key People", status: "pending" },
  { id: "tech-product", label: "Product & Tech Stack", status: "pending" },
  { id: "culture", label: "Culture & Sentiment", status: "pending" },
  { id: "layoffs", label: "Layoffs & Restructuring", status: "pending" },
  { id: "interview-prep", label: "Interview Preparation", status: "pending" },
];

export async function runResearchPipeline(
  jobDescription: string,
  emit: (event: PipelineEvent) => void
): Promise<void> {
  const steps = STEPS.map((s) => ({ ...s }));
  const report: ResearchReport = {} as ResearchReport;

  function updateStep(id: string, status: StepInfo["status"]) {
    const step = steps.find((s) => s.id === id);
    if (step) step.status = status;
    emit({ type: "progress", steps: steps.map((s) => ({ ...s })) });
  }

  try {
    // Step 0: Parse JD
    console.log("[pipeline] Starting: parse-jd");
    updateStep("parse-jd", "running");
    report.parsedJD = await parseJobDescription(jobDescription);
    console.log("[pipeline] Completed: parse-jd", report.parsedJD.companyName);
    updateStep("parse-jd", "completed");
    emit({ type: "section", sectionId: "parsedJD", data: report.parsedJD });

    // Wave 1: Company Overview, Recent News, Financials (parallel)
    console.log("[pipeline] Starting Wave 1");
    const wave1StepIds = ["company-overview", "recent-news", "financials"];
    wave1StepIds.forEach((id) => updateStep(id, "running"));

    const [companyOverview, recentNews, financials] = await Promise.allSettled([
      researchCompanyOverview(report.parsedJD),
      researchRecentNews(report.parsedJD),
      researchFinancials(report.parsedJD),
    ]);

    if (companyOverview.status === "fulfilled") {
      report.companyOverview = companyOverview.value;
      updateStep("company-overview", "completed");
      emit({ type: "section", sectionId: "companyOverview", data: report.companyOverview });
    } else {
      updateStep("company-overview", "error");
      console.error("Company overview failed:", companyOverview.reason);
    }

    if (recentNews.status === "fulfilled") {
      report.recentNews = recentNews.value;
      updateStep("recent-news", "completed");
      emit({ type: "section", sectionId: "recentNews", data: report.recentNews });
    } else {
      updateStep("recent-news", "error");
      console.error("Recent news failed:", recentNews.reason);
    }

    if (financials.status === "fulfilled") {
      report.financials = financials.value;
      updateStep("financials", "completed");
      emit({ type: "section", sectionId: "financials", data: report.financials });
    } else {
      updateStep("financials", "error");
      console.error("Financials failed:", financials.reason);
    }

    // Wave 2: Key People, Tech & Product, Culture, Layoffs (parallel)
    const wave2StepIds = ["key-people", "tech-product", "culture", "layoffs"];
    wave2StepIds.forEach((id) => updateStep(id, "running"));

    const [keyPeople, techAndProduct, culture, layoffs] = await Promise.allSettled([
      researchKeyPeople(report.parsedJD),
      researchTechAndProduct(report.parsedJD),
      researchCulture(report.parsedJD),
      researchLayoffs(report.parsedJD),
    ]);

    if (keyPeople.status === "fulfilled") {
      report.keyPeople = keyPeople.value;
      updateStep("key-people", "completed");
      emit({ type: "section", sectionId: "keyPeople", data: report.keyPeople });
    } else {
      updateStep("key-people", "error");
      console.error("Key people failed:", keyPeople.reason);
    }

    if (techAndProduct.status === "fulfilled") {
      report.techAndProduct = techAndProduct.value;
      updateStep("tech-product", "completed");
      emit({ type: "section", sectionId: "techAndProduct", data: report.techAndProduct });
    } else {
      updateStep("tech-product", "error");
      console.error("Tech & product failed:", techAndProduct.reason);
    }

    if (culture.status === "fulfilled") {
      report.cultureSentiment = culture.value;
      updateStep("culture", "completed");
      emit({ type: "section", sectionId: "cultureSentiment", data: report.cultureSentiment });
    } else {
      updateStep("culture", "error");
      console.error("Culture failed:", culture.reason);
    }

    if (layoffs.status === "fulfilled") {
      report.layoffs = layoffs.value;
      updateStep("layoffs", "completed");
      emit({ type: "section", sectionId: "layoffs", data: report.layoffs });
    } else {
      updateStep("layoffs", "error");
      console.error("Layoffs failed:", layoffs.reason);
    }

    // Wave 3: Interview Prep (needs all prior data)
    updateStep("interview-prep", "running");
    report.interviewPrep = await generateInterviewPrep(report);
    updateStep("interview-prep", "completed");
    emit({ type: "section", sectionId: "interviewPrep", data: report.interviewPrep });

    emit({ type: "complete", report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    emit({ type: "error", message });
  }
}
