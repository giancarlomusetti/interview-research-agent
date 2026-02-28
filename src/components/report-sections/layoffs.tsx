"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Layoffs as LayoffsType } from "@/lib/research/types";

function getSignalBadge(interpretation: string) {
  const lower = interpretation.toLowerCase();
  if (lower.includes("distress")) {
    return <Badge variant="outline" className="border-amber-500/50 text-amber-600 text-xs">Distress Signal</Badge>;
  }
  if (lower.includes("discipline") || lower.includes("strategic")) {
    return <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 text-xs">Strategic Discipline</Badge>;
  }
  return <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground text-xs">Mixed Signals</Badge>;
}

export function LayoffsSection({ data }: { data: LayoffsType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📉</span> Layoffs & Stability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data.hasLayoffs ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground italic">
              No significant layoffs or restructuring events found.
            </p>
            {getSignalBadge("strategic")}
          </div>
        ) : (
          <>
            {/* Signal badge */}
            <div className="flex items-center gap-2">
              {getSignalBadge(data.signalInterpretation)}
              <p className="text-xs text-muted-foreground">{data.signalInterpretation}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              {data.events.map((event, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="shrink-0 w-28 text-xs text-muted-foreground pt-0.5 text-right">
                    {event.date ?? "Unknown date"}
                  </div>
                  <div className="border-l-2 border-border pl-3 pb-2 space-y-0.5">
                    <p className="font-medium leading-tight">
                      {event.affectedCount && <span className="text-foreground">{event.affectedCount} — </span>}
                      {event.description}
                    </p>
                    {event.approach && (
                      <p className="text-xs text-primary/80">{event.approach}</p>
                    )}
                    {event.sourceUrl && (
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary/70 hover:text-primary underline underline-offset-2 decoration-primary/30"
                      >
                        Source &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Overall Approach
              </p>
              <p className="text-sm text-muted-foreground">{data.overallApproach}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Public Sentiment
              </p>
              <p className="text-sm text-muted-foreground">{data.sentiment}</p>
            </div>

            {/* Suggested question tip box */}
            {data.suggestedQuestion && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-primary/80 font-medium mb-1">Question to Ask</p>
                <p className="text-sm text-muted-foreground italic">&ldquo;{data.suggestedQuestion}&rdquo;</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
