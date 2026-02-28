"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Layoffs as LayoffsType } from "@/lib/research/types";

export function LayoffsSection({ data }: { data: LayoffsType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📉</span> Layoffs & Restructuring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data.hasLayoffs ? (
          <p className="text-sm text-muted-foreground italic">
            No significant layoffs or restructuring events found.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {data.events.map((event, i) => (
                <div key={i} className="border-l-2 border-border pl-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{event.description}</p>
                    {event.date && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {event.date}
                      </span>
                    )}
                  </div>
                  {event.affectedCount && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Affected:</span> {event.affectedCount}
                    </p>
                  )}
                  {event.approach && (
                    <p className="text-xs text-primary/80">
                      <span className="font-medium">Approach:</span> {event.approach}
                    </p>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
