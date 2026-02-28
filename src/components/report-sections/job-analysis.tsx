"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ParsedJD } from "@/lib/research/types";

export function JobAnalysis({ data }: { data: ParsedJD }) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📋</span> Job Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Role</p>
            <p className="font-medium">{data.roleTitle}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Company</p>
            <p className="font-medium">{data.companyName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seniority</p>
            <p className="font-medium">{data.seniorityLevel}</p>
          </div>
          {data.department && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</p>
              <p className="font-medium">{data.department}</p>
            </div>
          )}
          {data.location && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
              <p className="font-medium">{data.location}</p>
            </div>
          )}
          {data.salaryRange && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Compensation</p>
              <p className="font-medium">{data.salaryRange}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
          <p className="text-sm text-muted-foreground">{data.summary}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {data.niceToHaveSkills && data.niceToHaveSkills.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Nice to Have</p>
            <div className="flex flex-wrap gap-1.5">
              {data.niceToHaveSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Key Responsibilities</p>
          <ul className="space-y-1">
            {data.responsibilities.map((r, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-muted-foreground/50 shrink-0">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
