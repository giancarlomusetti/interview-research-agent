"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewPrep as InterviewPrepType } from "@/lib/research/types";

const CATEGORY_COLORS: Record<string, string> = {
  technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  behavioral: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "company-specific": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "role-specific": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function InterviewPrepSection({ data }: { data: InterviewPrepType }) {
  const [expandedTheirQ, setExpandedTheirQ] = useState<number | null>(null);
  const [expandedYourQ, setExpandedYourQ] = useState<number | null>(null);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary/20">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🎯</span> Interview Preparation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-primary/80 font-medium uppercase tracking-wider mb-2">Overall Strategy</p>
          <p className="text-sm text-foreground leading-relaxed">{data.overallStrategy}</p>
        </div>

        {/* Questions they'll ask — accordion */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Questions They&apos;ll Likely Ask You</h3>
          <div className="divide-y divide-border">
            {data.questionsTheyWillAsk.map((q, i) => {
              const isOpen = expandedTheirQ === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExpandedTheirQ(isOpen ? null : i)}
                  className="w-full text-left py-2.5 first:pt-0 last:pb-0 group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground/60 font-mono mt-0.5 shrink-0 w-4 text-center">
                      {isOpen ? "−" : "+"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                          {q.question}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                            CATEGORY_COLORS[q.category] ?? "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {q.category}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Why they ask:</span> {q.whyTheyAsk}
                          </p>
                          <p className="text-xs text-primary/70">
                            <span className="font-medium">Approach:</span> {q.suggestedApproach}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions you should ask — accordion */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Smart Questions to Ask Them</h3>
          <div className="divide-y divide-border">
            {data.questionsYouShouldAsk.map((q, i) => {
              const isOpen = expandedYourQ === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExpandedYourQ(isOpen ? null : i)}
                  className="w-full text-left py-2.5 first:pt-0 last:pb-0 group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground/60 font-mono mt-0.5 shrink-0 w-4 text-center">
                      {isOpen ? "−" : "+"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                        {q.question}
                      </p>

                      {isOpen && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-xs text-muted-foreground">{q.rationale}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Talking points — simple bullet list */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">Key Talking Points</h3>
          <ul className="space-y-1.5">
            {data.keyTalkingPoints.map((tp, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-muted-foreground/50 shrink-0">-</span>
                <span><span className="font-medium text-foreground">{tp.point}</span> — {tp.context}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
