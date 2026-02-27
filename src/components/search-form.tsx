"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE_CHIPS = [
  {
    label: "Senior Frontend Engineer",
    text: `Senior Frontend Engineer - Stripe

About the role:
We're looking for a Senior Frontend Engineer to join our Payments team. You'll build and maintain the dashboard experiences that millions of businesses use to manage their payments.

Requirements:
- 5+ years of experience with React and TypeScript
- Experience with large-scale web applications
- Strong understanding of web performance optimization
- Experience with design systems and component libraries
- Familiarity with payment systems or fintech is a plus

Responsibilities:
- Build and maintain payment dashboard features
- Collaborate with designers and PMs to ship user-facing products
- Improve frontend infrastructure and developer experience
- Mentor junior engineers

Location: San Francisco or Remote (US)
Compensation: $180K - $250K + equity`,
  },
  {
    label: "Product Manager",
    text: `Product Manager, Growth - Notion

We're looking for a Product Manager to lead our Growth team at Notion. You'll drive user acquisition, activation, and retention strategies for our collaboration platform used by millions.

Requirements:
- 4+ years of product management experience, with 2+ years in growth
- Strong analytical skills - comfortable with SQL, A/B testing, funnel analysis
- Experience with PLG (product-led growth) strategies
- Excellent communication skills and ability to work cross-functionally
- Experience at a SaaS or productivity company preferred

Responsibilities:
- Define and execute growth strategy across the user funnel
- Run experiments to improve key metrics (activation, retention, conversion)
- Partner with engineering, design, data science, and marketing teams
- Present insights and strategy to leadership

Location: San Francisco, Hybrid
Compensation: $170K - $220K + equity`,
  },
  {
    label: "Data Scientist",
    text: `Data Scientist - Airbnb

Airbnb's Data Science team is hiring! Join us to apply ML and statistical methods to improve the experience for millions of hosts and guests worldwide.

Requirements:
- MS or PhD in Statistics, Computer Science, or related quantitative field
- 3+ years of industry experience in data science or machine learning
- Proficiency in Python and SQL
- Experience with A/B testing and causal inference
- Familiarity with deep learning frameworks (PyTorch, TensorFlow)
- Strong communication skills for presenting to non-technical stakeholders

Responsibilities:
- Build ML models to improve search ranking and recommendation systems
- Design and analyze A/B experiments
- Partner with product and engineering to ship data-driven features
- Develop metrics and dashboards to track business performance

Location: San Francisco
Compensation: $190K - $260K + equity + benefits`,
  },
];

interface SearchFormProps {
  onSubmit: (jobDescription: string) => void;
  disabled?: boolean;
}

export function SearchForm({ onSubmit, disabled }: SearchFormProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a job description here..."
          disabled={disabled}
          className="min-h-[200px] resize-y bg-card text-card-foreground border-border placeholder:text-muted-foreground text-sm leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {input.length.toLocaleString()} / 15,000
        </div>
      </div>

      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {disabled ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Researching...
          </span>
        ) : (
          "Research this company"
        )}
      </Button>

      {!disabled && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            Or try an example:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setInput(chip.text)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
