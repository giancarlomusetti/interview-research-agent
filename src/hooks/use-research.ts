"use client";

import { useState, useCallback, useRef } from "react";
import type { StepInfo, ResearchReport, PipelineEvent } from "@/lib/research/types";

type ResearchState = "idle" | "loading" | "complete" | "error";

interface UseResearchReturn {
  state: ResearchState;
  steps: StepInfo[];
  report: Partial<ResearchReport>;
  error: string | null;
  startResearch: (jobDescription: string) => void;
  reset: () => void;
}

export function useResearch(): UseResearchReturn {
  const [state, setState] = useState<ResearchState>("idle");
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [report, setReport] = useState<Partial<ResearchReport>>({});
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState("idle");
    setSteps([]);
    setReport({});
    setError(null);
  }, []);

  const startResearch = useCallback((jobDescription: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState("loading");
    setSteps([]);
    setReport({});
    setError(null);

    (async () => {
      try {
        const response = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message ?? data.error ?? "Request failed");
          setState("error");
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setError("No response stream");
          setState("error");
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const event: PipelineEvent = JSON.parse(data);
                switch (event.type) {
                  case "progress":
                    setSteps(event.steps);
                    break;
                  case "section":
                    setReport((prev) => ({
                      ...prev,
                      [event.sectionId]: event.data,
                    }));
                    break;
                  case "complete":
                    setState("complete");
                    break;
                  case "error":
                    setError(event.message);
                    setState("error");
                    break;
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        }

        // If we didn't get a complete or error event, set complete
        setState((prev) => (prev === "loading" ? "complete" : prev));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message ?? "An unexpected error occurred");
        setState("error");
      }
    })();
  }, []);

  return { state, steps, report, error, startResearch, reset };
}
