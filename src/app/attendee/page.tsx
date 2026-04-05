"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type DiscoveryAssistantKey,
  discoveryAssistantCatalog,
  recommendEventsForAgents,
} from "@/lib/assistants";
import { gatherlyTheme as t } from "@/styles/theme";

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
    <main className={`min-h-screen text-slate-100 ${t.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={t.pageHero}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={t.eyebrow}>Attendee</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Subscribe to assistants that match your interests.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/chat" className={t.navLink}>
                Chat
              </Link>
              <Link href="/community" className={t.navLink}>
                Community
              </Link>
              <Link href="/attendee" className={t.navLink}>
                Attendee
              </Link>
              <Link href="/agents" className={t.navLink}>
                Assistants
              </Link>
              <Link href="/organizer" className={t.buttonPrimaryPill}>
                Organizer
              </Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Discovery assistants scan sample events and surface ones that fit—same assistants as the Attendee role on
            the Assistants page.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={t.section}>
            <h2 className="text-2xl font-semibold">Your interests</h2>
            <textarea value={interests} onChange={(e) => setInterests(e.target.value)} className={`mt-4 ${t.textarea}`} />
            <h3 className={`mt-6 text-lg font-medium ${t.accent}`}>Subscribe to discovery assistants</h3>
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
                      active ? t.cardSelectableActive : t.cardSelectableIdle
                    }`}
                  >
                    <p className={`text-sm ${t.accent}`}>{active ? "subscribed" : "available"}</p>
                    <h4 className="mt-1 text-lg font-semibold">{agent.name}</h4>
                    <p className={`mt-2 text-sm ${t.bodyMuted}`}>{agent.summary}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={t.section}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recommended events</h2>
              <span className={t.caption}>{recommended.length} matches</span>
            </div>
            <div className="mt-6 space-y-4">
              {recommended.map((event) => (
                <div key={event.id} data-testid={`attendee-event-${event.id}`} className={t.panel}>
                  <p className={`text-sm ${t.accent}`}>{event.location}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{event.title}</h3>
                  <p className={`mt-2 ${t.bodyMuted}`}>{event.description}</p>
                  <p className={`mt-3 text-sm ${t.caption}`}>{event.date}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "interested" }))}
                      className={t.buttonOutline}
                    >
                      Interested
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "attending" }))}
                      className={t.buttonPrimaryPill}
                    >
                      Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance((s) => ({ ...s, [event.id]: "pass" }))}
                      className={t.buttonOutline}
                    >
                      Pass
                    </button>
                  </div>
                  {attendance[event.id] ? (
                    <p data-testid={`attendee-status-${event.id}`} className={`mt-3 text-sm ${t.accent}`}>
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
