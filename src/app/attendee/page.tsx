"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AgentKey =
  | "frontend-scout"
  | "ai-demo-hunter"
  | "hackathon-radar"
  | "after-work-social-finder"
  | "beginner-friendly-guide";

const attendeeAgents: Record<AgentKey, { name: string; matches: string[]; summary: string }> = {
  "frontend-scout": {
    name: "Frontend Scout",
    matches: ["frontend", "react", "design", "ui", "components"],
    summary: "Finds UI, frontend, and design-system events.",
  },
  "ai-demo-hunter": {
    name: "AI Demo Hunter",
    matches: ["ai", "demo", "model", "ml", "agent"],
    summary: "Looks for AI demos, launches, and model-builder events.",
  },
  "hackathon-radar": {
    name: "Hackathon Radar",
    matches: ["hackathon", "sprint", "build", "prototype", "ship"],
    summary: "Tracks hack nights, build sprints, and hackathons.",
  },
  "after-work-social-finder": {
    name: "After-Work Social Finder",
    matches: ["happy hour", "social", "mixer", "after hours", "dinner"],
    summary: "Surfaces casual events for meeting people after work.",
  },
  "beginner-friendly-guide": {
    name: "Beginner-Friendly Guide",
    matches: ["beginner", "intro", "workshop", "office hours", "friendly"],
    summary: "Highlights welcoming events with lower intimidation factor.",
  },
};

const sampleEvents = [
  { id: 1, title: "Coffee & Components", description: "A frontend coffee chat for people who like UI systems and React.", location: "Austin", date: "Apr 18 · 10:00 AM" },
  { id: 2, title: "Demo Jam: AI Builders Edition", description: "A demo night for AI builders showing prototypes and weird projects.", location: "East Austin", date: "Apr 20 · 7:00 PM" },
  { id: 3, title: "Build Sprint Night", description: "A mini hackathon for developers who want to prototype fast in teams.", location: "Downtown", date: "Apr 23 · 6:30 PM" },
  { id: 4, title: "Beginner Office Hours", description: "A welcoming workshop for newer developers with mentors on hand.", location: "Library Lab", date: "Apr 24 · 5:30 PM" },
];

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function AttendeePage() {
  const [interests, setInterests] = useState("frontend, ai, demo nights");
  const [subscribed, setSubscribed] = useState<AgentKey[]>(["frontend-scout", "ai-demo-hunter"]);
  const [attendance, setAttendance] = useState<Record<number, "interested" | "attending" | "pass" | undefined>>({});

  const recommended = useMemo(() => {
    return sampleEvents.filter((event) => {
      const haystack = `${event.title} ${event.description}`.toLowerCase();
      return subscribed.some((key) => attendeeAgents[key].matches.some((term) => haystack.includes(term)));
    });
  }, [subscribed]);

  function toggleAgent(agent: AgentKey) {
    setSubscribed((current) => current.includes(agent) ? current.filter((a) => a !== agent) : [...current, agent]);
  }

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>Attendee</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Subscribe to agents that match your interests.
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Home</Link>
              <Link href="/agents" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">AI agents</Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Pick attendee agents and let them surface events that fit your vibe.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Your interests</h2>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="mt-4 h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100"
            />
            <h3 className="mt-6 text-lg font-medium text-cyan-300">Subscribe to attendee agents</h3>
            <div className="mt-4 space-y-3">
              {(Object.entries(attendeeAgents) as [AgentKey, (typeof attendeeAgents)[AgentKey]][]).map(([key, agent]) => {
                const active = subscribed.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAgent(key)}
                    className={`w-full rounded-2xl border p-4 text-left ${active ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-slate-900/50'}`}
                  >
                    <p className="text-sm text-cyan-300">{active ? 'subscribed' : 'available'}</p>
                    <h4 className="mt-1 text-lg font-semibold">{agent.name}</h4>
                    <p className="mt-2 text-sm text-slate-300">{agent.summary}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recommended events</h2>
              <span className="text-sm text-slate-400">{recommended.length} matches</span>
            </div>
            <div className="mt-6 space-y-4">
              {recommended.map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                  <p className="text-sm text-cyan-300">{event.location}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-2 text-slate-300">{event.description}</p>
                  <p className="mt-3 text-sm text-slate-400">{event.date}</p>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => setAttendance((s) => ({ ...s, [event.id]: 'interested' }))} className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Interested</button>
                    <button type="button" onClick={() => setAttendance((s) => ({ ...s, [event.id]: 'attending' }))} className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>Attending</button>
                    <button type="button" onClick={() => setAttendance((s) => ({ ...s, [event.id]: 'pass' }))} className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Pass</button>
                  </div>
                  {attendance[event.id] ? (
                    <p className="mt-3 text-sm text-cyan-300">Status: {attendance[event.id]}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
