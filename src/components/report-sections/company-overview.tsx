"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceLinks } from "./source-links";
import type { CompanyOverview as CompanyOverviewType } from "@/lib/research/types";

export function CompanyOverviewSection({ data }: { data: CompanyOverviewType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🏢</span> Company Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {data.industry && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
              <p className="text-sm font-medium">{data.industry}</p>
            </div>
          )}
          {data.founded && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Founded</p>
              <p className="text-sm font-medium">{data.founded}</p>
            </div>
          )}
          {data.headquarters && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Headquarters</p>
              <p className="text-sm font-medium">{data.headquarters}</p>
            </div>
          )}
          {data.employeeCount && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Employees</p>
              <p className="text-sm font-medium">{data.employeeCount}</p>
            </div>
          )}
        </div>

        {data.mission && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mission</p>
            <p className="text-sm italic text-muted-foreground">&ldquo;{data.mission}&rdquo;</p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Key Facts</p>
          <ul className="space-y-1">
            {data.keyFacts.map((fact, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-muted-foreground/50 shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <SourceLinks sources={data.sources} />
      </CardContent>
    </Card>
  );
}
