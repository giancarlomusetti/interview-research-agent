"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceLinks } from "./source-links";
import type { KeyPeople as KeyPeopleType } from "@/lib/research/types";

export function KeyPeopleSection({ data }: { data: KeyPeopleType }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">👥</span> Key People
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {data.people.map((person, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-1">
              <p className="text-sm font-medium">{person.name}</p>
              <p className="text-xs text-primary/80">{person.title}</p>
              <p className="text-xs text-muted-foreground">{person.background}</p>
              {person.notableInfo && (
                <p className="text-xs text-muted-foreground italic">{person.notableInfo}</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-primary/80 font-medium mb-1">Interview Tip</p>
          <p className="text-sm text-muted-foreground">{data.interviewTip}</p>
        </div>

        <SourceLinks sources={data.sources} />
      </CardContent>
    </Card>
  );
}
