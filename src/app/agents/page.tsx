"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AgentKey =
  | "coffee-chat-curator"
  | "demo-night-organizer"
  | "hackathon-host"
  | "after-work-social-planner"
  | "tech-talk-producer"
  | "beginner-community-host";

const agentCatalog: Record<AgentKey, {
  name: string;
  tone: string;
  summary: string;
  sampleTitle: string;
  venue: string;
}> = {
  "coffee-chat-curator": {
    name: "Coffee Chat Curator",
    tone: "casual",
    summary: "Turns prompts into warm, low-pressure meetup ideas for developers who want conversation over performance.",
    sampleTitle: "Coffee & Components",
    venue: "cafe or coffee shop",
  },
  "demo-night-organizer": {
    name: "Demo Night Organizer",
    tone: "showcase",
    summary: "Creates event ideas built around shipping, demos, launches, and playful show-and-tell energy.",
    sampleTitle: "Demo Jam",
    venue: "startup office or community space",
  },
  "hackathon-host": {
    name: "Hackathon Host",
    tone: "high-energy",
    summary: "Designs build sprints, team-up nights, and mini-hack experiences with momentum.",
    sampleTitle: "Build Sprint Night",
    venue: "campus hall or coworking venue",
  },
  "after-work-social-planner": {
    name: "After-Work Social Planner",
    tone: "social",
    summary: "Generates relaxed events for people who want to meet other builders after work without conference vibes.",
    sampleTitle: "Builders After Hours",
    venue: "bar, patio, or lounge",
  },
  "tech-talk-producer": {
    name: "Tech Talk Producer",
    tone: "structured",
    summary: "Creates event concepts that feel polished, speaker-friendly, and worth RSVPing to.",
    sampleTitle: "Architecture & Answers",
    venue: "auditorium or meetup room",
  },
  "beginner-community-host": {
    name: "Beginner-Friendly Community Host",
    tone: "welcoming",
    summary: "Designs entry-level events that help new developers feel included and less intimidated.",
    sampleTitle: "First PR Club",
    venue: "library room or workshop space",
  },
};

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

function generateSuggestion(agent: AgentKey, prompt: string) {
  const normalized = prompt.toLowerCase();
  const preset = agentCatalog[agent];

  if (agent === "coffee-chat-curator" && normalized.includes("frontend")) {
    return {
      title: "Coffee & Components",
      description: "A relaxed frontend meetup for engineers who want espresso, UI talk, and no pressure.",
      venue: "indie coffee shop",
      vibe: "friendly, chatty, low-key",
    };
  }

  if (agent === "demo-night-organizer" && normalized.includes("ai")) {
    return {
      title: "Demo Jam: AI Builders Edition",
      description: "A show-and-tell night for people building AI tools, weird prototypes, and side projects.",
      venue: "startup office",
      vibe: "fast, nerdy, show-your-work",
    };
  }

  if (agent === "hackathon-host") {
    return {
      title: "Build Sprint Night",
      description: "A one-evening hackathon-style meetup where strangers team up, prototype quickly, and share demos.",
      venue: "coworking space",
      vibe: "energetic, collaborative, slightly chaotic",
    };
  }

  return {
    title: preset.sampleTitle,
    description: `A ${preset.tone} event inspired by: ${prompt}`,
    venue: preset.venue,
    vibe: `${preset.tone}, community-driven, developer-friendly`,
  };
}

export default function AgentsPage() {
  const [selected, setSelected] = useState<AgentKey>("coffee-chat-curator");
  const [prompt, setPrompt] = useState("something for frontend engineers who like coffee");
  const suggestion = useMemo(() => generateSuggestion(selected, prompt), [selected, prompt]);

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>AI Agents</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Pick a canned agent and get event ideas.
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Home</Link>
              <Link href="/organizer" className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>Organizer</Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            These canned agents suggest different event flavors based on the kind of community you want.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Choose an agent</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(Object.entries(agentCatalog) as [AgentKey, (typeof agentCatalog)[AgentKey]][]).map(([key, agent]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`rounded-2xl border p-4 text-left transition ${selected === key ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-slate-900/50'}`}
                >
                  <p className="text-sm text-cyan-300">{agent.tone}</p>
                  <h3 className="mt-1 text-xl font-semibold">{agent.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{agent.summary}</p>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Prompt</h2>
            <p className="mt-2 text-sm text-slate-300">Describe the kind of developer event you want.</p>
            <div className="mt-4 space-y-3">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100"
                placeholder="something for frontend engineers who like coffee"
              />
            </div>
          </section>
        </div>

        <section className={`rounded-2xl border p-6 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Suggested event</h2>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
              {agentCatalog[selected].name}
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
              <p className="text-sm text-cyan-300">{agentCatalog[selected].tone}</p>
              <h3 className="mt-1 text-3xl font-semibold">{suggestion.title}</h3>
              <p className="mt-3 text-slate-300">{suggestion.description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-sm text-slate-300">
              <p><span className="text-slate-400">Best venue:</span> {suggestion.venue}</p>
              <p className="mt-2"><span className="text-slate-400">Audience vibe:</span> {suggestion.vibe}</p>
              <p className="mt-2"><span className="text-slate-400">Agent venue style:</span> {agentCatalog[selected].venue}</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
