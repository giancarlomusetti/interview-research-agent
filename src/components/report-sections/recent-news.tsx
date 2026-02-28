"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentNews as RecentNewsType } from "@/lib/research/types";

export function RecentNewsSection({ data }: { data: RecentNewsType }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📰</span> Recent News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground italic">{data.overallNarrative}</p>

        <div className="divide-y divide-border">
          {data.items.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full text-left py-2.5 first:pt-0 last:pb-0 group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground/60 font-mono mt-0.5 shrink-0 w-4 text-center">
                    {isOpen ? "−" : "+"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                        {item.headline}
                      </h4>
                      {item.date && (
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                          {item.date}
                        </span>
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.summary}
                        </p>
                        <p className="text-xs text-primary/80">
                          <span className="font-medium">Why it matters:</span> {item.relevanceToRole}
                        </p>
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block text-xs text-primary/70 hover:text-primary underline underline-offset-2 decoration-primary/30"
                          >
                            Read source &rarr;
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
