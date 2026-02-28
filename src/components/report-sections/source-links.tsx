"use client";

interface SourceLink {
  title: string;
  url: string;
}

export function SourceLinks({ sources }: { sources: SourceLink[] | null | undefined }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="pt-3 border-t border-border">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Sources</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary/70 hover:text-primary underline underline-offset-2 decoration-primary/30"
          >
            {s.title} &rarr;
          </a>
        ))}
      </div>
    </div>
  );
}
