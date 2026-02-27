"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentNews as RecentNewsType } from "@/lib/research/types";

export function RecentNewsSection({ data }: { data: RecentNewsType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📰</span> Recent News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground italic">{data.overallNarrative}</p>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="border-l-2 border-border pl-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-tight">{item.headline}</h4>
                {item.date && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{item.date}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item.summary}</p>
              <p className="text-xs text-primary/80">
                <span className="font-medium">Relevance:</span> {item.relevanceToRole}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
