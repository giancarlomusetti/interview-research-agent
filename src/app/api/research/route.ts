import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { runResearchPipeline } from "@/lib/research/pipeline";
import type { PipelineEvent } from "@/lib/research/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const retryAfterSec = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: `You've used all 10 daily researches. Try again in ${Math.ceil(retryAfterSec / 3600)} hours.`,
        resetAt: rateLimit.resetAt,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  // Parse input
  let jobDescription: string;
  try {
    const body = await request.json();
    jobDescription = body.jobDescription;
    if (!jobDescription || typeof jobDescription !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing jobDescription field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (jobDescription.length > 15000) {
      return new Response(
        JSON.stringify({ error: "Job description is too long (max 15,000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // SSE stream using TransformStream for reliable async handling
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  function emit(event: PipelineEvent) {
    const data = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
    writer.write(encoder.encode(data));
  }

  // Run pipeline in background — don't await, let the stream flow
  runResearchPipeline(jobDescription, emit)
    .then(() => {
      writer.close();
    })
    .catch((error) => {
      console.error("[research] Pipeline error:", error);
      const message = error instanceof Error ? error.message : "Pipeline failed";
      emit({ type: "error", message });
      writer.close();
    });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-RateLimit-Remaining": String(rateLimit.remaining),
    },
  });
}
