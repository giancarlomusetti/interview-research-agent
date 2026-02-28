"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InterviewPrep as InterviewPrepType } from "@/lib/research/types";

const CATEGORY_COLORS: Record<string, string> = {
  technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  behavioral: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "company-specific": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "role-specific": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function InterviewPrepSection({ data }: { data: InterviewPrepType }) {
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

        {/* Questions they'll ask */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Questions They&apos;ll Likely Ask You</h3>
          <div className="space-y-3">
            {data.questionsTheyWillAsk.map((q, i) => (
              <div key={i} className="space-y-1.5 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{q.question}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          CATEGORY_COLORS[q.category] ?? "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {q.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Why they ask:</span> {q.whyTheyAsk}
                    </p>
                    <p className="text-xs text-primary/70">
                      <span className="font-medium">Approach:</span> {q.suggestedApproach}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions you should ask */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Smart Questions to Ask Them</h3>
          <div className="space-y-2.5">
            {data.questionsYouShouldAsk.map((q, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs text-muted-foreground font-mono mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talking points */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Key Talking Points</h3>
          <div className="space-y-2.5">
            {data.keyTalkingPoints.map((tp, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-1">
                <p className="text-sm font-medium">{tp.point}</p>
                <p className="text-xs text-muted-foreground">{tp.context}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
