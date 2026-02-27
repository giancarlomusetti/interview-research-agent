"use client";

import type { StepInfo } from "@/lib/research/types";

const STATUS_ICONS: Record<StepInfo["status"], string> = {
  pending: "text-muted-foreground/40",
  running: "text-primary animate-pulse",
  completed: "text-emerald-500",
  error: "text-destructive",
};

function StepIcon({ status }: { status: StepInfo["status"] }) {
  if (status === "completed") {
    return (
      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "running") {
    return (
      <span className="h-4 w-4 flex items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
      </span>
    );
  }
  if (status === "error") {
    return (
      <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <span className="h-4 w-4 flex items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
    </span>
  );
}

interface ResearchProgressProps {
  steps: StepInfo[];
}

export function ResearchProgress({ steps }: ResearchProgressProps) {
  if (steps.length === 0) return null;

  const completed = steps.filter((s) => s.status === "completed").length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Research progress</span>
          <span>{completed}/{total} steps</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Step list */}
      <div className="grid gap-1.5">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2.5 py-1 text-sm transition-opacity duration-300 ${
              step.status === "pending" ? "opacity-40" : "opacity-100"
            }`}
          >
            <StepIcon status={step.status} />
            <span
              className={
                step.status === "running"
                  ? "text-foreground font-medium"
                  : step.status === "completed"
                    ? "text-foreground"
                    : "text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
