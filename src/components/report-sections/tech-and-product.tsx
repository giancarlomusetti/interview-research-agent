"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SourceLinks } from "./source-links";
import type { TechAndProduct as TechAndProductType } from "@/lib/research/types";

export function TechAndProductSection({ data }: { data: TechAndProductType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🛠️</span> Product & Tech Stack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Products</p>
          <div className="space-y-2">
            {data.products.map((product, i) => (
              <div key={i}>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.description}</p>
              </div>
            ))}
          </div>
        </div>

        {data.techStack && data.techStack.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {data.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs font-mono">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.engineeringCulture && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Engineering Culture</p>
            <p className="text-sm text-muted-foreground">{data.engineeringCulture}</p>
          </div>
        )}

        {data.recentLaunches && data.recentLaunches.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recent Launches</p>
            <ul className="space-y-1">
              {data.recentLaunches.map((launch, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-muted-foreground/50 shrink-0">•</span>
                  {launch}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-primary/80 font-medium mb-1">Relevance to Your Role</p>
          <p className="text-sm text-muted-foreground">{data.relevanceToRole}</p>
        </div>

        <SourceLinks sources={data.sources} />
      </CardContent>
    </Card>
  );
}
