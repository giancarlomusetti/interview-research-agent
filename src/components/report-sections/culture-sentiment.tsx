"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceLinks } from "./source-links";
import type { CultureSentiment as CultureSentimentType } from "@/lib/research/types";

export function CultureSentimentSection({ data }: { data: CultureSentimentType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🌱</span> Culture & Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground italic">{data.overallSentiment}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {data.glassdoorRating && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Glassdoor Rating</p>
              <p className="text-sm font-medium">{data.glassdoorRating}</p>
            </div>
          )}
          {data.remotePolicy && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remote Policy</p>
              <p className="text-sm font-medium">{data.remotePolicy}</p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-emerald-500 uppercase tracking-wider mb-2 font-medium">What Employees Like</p>
            <ul className="space-y-1">
              {data.positives.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-emerald-500/60 shrink-0">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-amber-500 uppercase tracking-wider mb-2 font-medium">Common Criticisms</p>
            <ul className="space-y-1">
              {data.negatives.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-amber-500/60 shrink-0">-</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.companyValues && data.companyValues.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Company Values</p>
            <div className="flex flex-wrap gap-1.5">
              {data.companyValues.map((value) => (
                <span
                  key={value}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.interviewProcess && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Interview Process</p>
            <p className="text-sm text-muted-foreground">{data.interviewProcess}</p>
          </div>
        )}

        <SourceLinks sources={data.sources} />
      </CardContent>
    </Card>
  );
}
