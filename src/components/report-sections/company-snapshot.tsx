"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceLinks } from "./source-links";
import type { CompanyOverview, Financials } from "@/lib/research/types";

interface CompanySnapshotProps {
  companyOverview: CompanyOverview;
  financials?: Financials;
}

export function CompanySnapshotSection({ companyOverview, financials }: CompanySnapshotProps) {
  const co = companyOverview;
  const f = financials;

  const allSources = [
    ...(co.sources ?? []),
    ...(f?.sources ?? []),
  ];

  // Build stat items for the number cards
  const stats: { label: string; value: string }[] = [];
  if (co.employeeCount) stats.push({ label: "Employees", value: co.employeeCount });
  if (f?.publicOrPrivate) stats.push({ label: "Status", value: f.publicOrPrivate });
  if (f?.valuation) stats.push({ label: "Valuation", value: f.valuation });
  if (f?.totalFundingRaised) stats.push({ label: "Total Raised", value: f.totalFundingRaised });
  if (f?.lastFundingRound) stats.push({ label: "Last Round", value: f.lastFundingRound });
  if (co.founded) stats.push({ label: "Founded", value: co.founded });

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🏢</span> Company Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* No-BS summary */}
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {co.noBSSummary}
        </p>

        {/* Stat cards */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Financial health one-liner */}
        {f?.financialHealth && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Financial health:</span> {f.financialHealth}
          </p>
        )}

        {/* Key investors */}
        {f?.keyInvestors && f.keyInvestors.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Investors:</span> {f.keyInvestors.join(", ")}
          </p>
        )}

        {/* Key facts */}
        {co.keyFacts.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Key Facts</p>
            <ul className="space-y-0.5">
              {co.keyFacts.map((fact, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-muted-foreground/50 shrink-0">-</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}

        <SourceLinks sources={allSources.length > 0 ? allSources : null} />
      </CardContent>
    </Card>
  );
}
