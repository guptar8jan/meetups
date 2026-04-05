"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type DiscoveryAssistantKey,
  discoveryAssistantCatalog,
  recommendEventsForAgents,
  sampleDiscoverableEvents,
} from "@/lib/assistants";

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function AttendeePage() {
  const [interests, setInterests] = useState("coffee on the porch, block parties, easy workshops");
  const [subscribed, setSubscribed] = useState<DiscoveryAssistantKey[]>(["social-scout"]);
  const [attendance, setAttendance] = useState<Record<number, "interested" | "attending" | "pass" | undefined>>(
    {}
  );

  const recommended = useMemo(() => recommendEventsForAgents(subscribed), [subscribed]);

  function toggleAgent(agent: DiscoveryAssistantKey) {
    setSubscribed((current) =>
      current.includes(agent) ? current.filter((a) => a !== agent) : [...current, agent]
    );
  }

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>Attendee</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Subscribe to assistants that match your interests.
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/chat" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Chat</Link>
              <Link href="/community" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Community</Link>
              <Link href="/attendee" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Attendee</Link>
              <Link href="/agents" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Assistants</Link>
              <Link href="/organizer" className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-100`}>Organizer</Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Discovery assistants scan sample events and surface ones that fit—same assistants as the Attendee role on
            the Assistants page.
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
            <h3 className="mt-6 text-lg font-medium text-cyan-300">Subscribe to discovery assistants</h3>
            <div className="mt-4 space-y-3">
              {(
                Object.entries(discoveryAssistantCatalog) as [
                  DiscoveryAssistantKey,
                  (typeof discoveryAssistantCatalog)[DiscoveryAssistantKey],
                ][]
              ).map(([key, agent]) => {
                const active = subscribed.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    data-testid={`attendee-assistant-${key}`}
                    onClick={() => toggleAgent(key)}
                    className={`w-full rounded-2xl border p-4 text-left ${
                      active ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-slate-900/50"
                    }`}
                  >
                    <p className="text-sm text-cyan-300">{active ? "subscribed" : "available"}</p>
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
                <div
                  key={event.id}
                  data-testid={`attendee-event-${event.id}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
                >
                  <p className="text-sm text-cyan-300">{event.location}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-2 text-slate-300">{event.description}</p>
                  <p className="mt-3 text-sm text-slate-400">{event.date}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "interested" }))}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100"
                    >
                      Interested
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "attending" }))}
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-100`}
                    >
                      Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "pass" }))}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100"
                    >
                      Pass
                    </button>
                  </div>
                  {attendance[event.id] ? (
                    <p data-testid={`attendee-status-${event.id}`} className="mt-3 text-sm text-cyan-300">
                      Status: {attendance[event.id]}
                    </p>
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
