"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceLinks } from "./source-links";
import type { Financials as FinancialsType } from "@/lib/research/types";

export function FinancialsSection({ data }: { data: FinancialsType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">💰</span> Funding & Financials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm font-medium">{data.publicOrPrivate}</p>
          </div>
          {data.totalFundingRaised && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Raised</p>
              <p className="text-sm font-medium">{data.totalFundingRaised}</p>
            </div>
          )}
          {data.lastFundingRound && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Round</p>
              <p className="text-sm font-medium">{data.lastFundingRound}</p>
            </div>
          )}
          {data.valuation && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valuation</p>
              <p className="text-sm font-medium">{data.valuation}</p>
            </div>
          )}
        </div>

        {data.keyInvestors && data.keyInvestors.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Investors</p>
            <p className="text-sm text-muted-foreground">{data.keyInvestors.join(", ")}</p>
          </div>
        )}

        {data.revenueInfo && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
            <p className="text-sm text-muted-foreground">{data.revenueInfo}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Financial Health</p>
          <p className="text-sm text-muted-foreground">{data.financialHealth}</p>
        </div>

        <SourceLinks sources={data.sources} />
      </CardContent>
    </Card>
  );
}
