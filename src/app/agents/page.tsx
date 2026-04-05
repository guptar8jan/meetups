"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type DiscoveryAssistantKey,
  type OrganizerAssistantKey,
  discoveryAssistantCatalog,
  generateOrganizerSuggestion,
  organizerAssistantCatalog,
  recommendEventsForAgents,
  sampleDiscoverableEvents,
} from "@/lib/assistants";
import { gatherlyTheme as t } from "@/styles/theme";

type Role = "organizer" | "attendee";

export default function AgentsPage() {
  const [role, setRole] = useState<Role>("organizer");
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerAssistantKey>("conversation-curator");
  const [organizerPrompt, setOrganizerPrompt] = useState(
    "a welcoming social event for people who enjoy coffee and conversation"
  );
  const organizerSuggestion = useMemo(
    () => generateOrganizerSuggestion(selectedOrganizer, organizerPrompt),
    [selectedOrganizer, organizerPrompt]
  );

  const [interests, setInterests] = useState("coffee on the porch, block parties, easy workshops");
  const [subscribedDiscovery, setSubscribedDiscovery] = useState<DiscoveryAssistantKey[]>([
    "social-scout",
    "neighborhood-scout",
  ]);

  const recommended = useMemo(
    () => recommendEventsForAgents(subscribedDiscovery),
    [subscribedDiscovery]
  );

  function toggleDiscovery(agent: DiscoveryAssistantKey) {
    setSubscribedDiscovery((current) =>
      current.includes(agent) ? current.filter((a) => a !== agent) : [...current, agent]
    );
  }

  return (
    <main className={`min-h-screen text-slate-100 ${t.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={t.pageHero}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className={t.eyebrow}>Assistants</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Assistants for organizers and attendees.
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Hosts get structured planning ideas. Guests get filters that make it easier to spot events worth their
                time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" role="tablist" aria-label="Assistant role">
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "organizer"}
                  data-testid="role-organizer"
                  onClick={() => setRole("organizer")}
                  className={role === "organizer" ? t.roleTabActive : t.roleTabInactive}
                >
                  Organizer role
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "attendee"}
                  data-testid="role-attendee"
                  onClick={() => setRole("attendee")}
                  className={role === "attendee" ? t.roleTabActive : t.roleTabInactive}
                >
                  Attendee role
                </button>
              </div>
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
        </div>

        {role === "organizer" ? (
          <>
            <p className="text-center text-sm text-slate-400 lg:text-left">
              Planning assistants — turn a short prompt into a concrete event shape.
            </p>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className={t.section}>
                <h2 className="text-2xl font-semibold">Pick a planning assistant</h2>
                <p className={`mt-2 text-sm ${t.bodyMuted}`}>Pick a planning assistant and get event ideas.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(
                    Object.entries(organizerAssistantCatalog) as [
                      OrganizerAssistantKey,
                      (typeof organizerAssistantCatalog)[OrganizerAssistantKey],
                    ][]
                  ).map(([key, assistant]) => (
                    <button
                      key={key}
                      type="button"
                      data-testid={`organizer-assistant-${key}`}
                      onClick={() => setSelectedOrganizer(key)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedOrganizer === key ? t.cardSelectableActive : t.cardSelectableIdle
                      }`}
                    >
                      <p className={`text-sm ${t.accent}`}>{assistant.tone}</p>
                      <h3 className="mt-1 text-xl font-semibold">{assistant.name}</h3>
                      <p className={`mt-2 text-sm ${t.bodyMuted}`}>{assistant.summary}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className={t.section}>
                <h2 className="text-2xl font-semibold">Prompt</h2>
                <p className={`mt-2 text-sm ${t.bodyMuted}`}>Describe the kind of event or gathering you want.</p>
                <div className="mt-4 space-y-3">
                  <input
                    value={organizerPrompt}
                    onChange={(e) => setOrganizerPrompt(e.target.value)}
                    className={t.input}
                    placeholder="a welcoming social event for people who enjoy coffee and conversation"
                  />
                </div>
              </section>
            </div>

            <section className={t.section}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Suggested event</h2>
                <span className={t.badgeAccentPill}>{organizerAssistantCatalog[selectedOrganizer].name}</span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div className={t.panel}>
                  <p className={`text-sm ${t.accent}`}>{organizerAssistantCatalog[selectedOrganizer].tone}</p>
                  <h3 data-testid="suggested-event-title" className="mt-1 text-3xl font-semibold">
                    {organizerSuggestion.title}
                  </h3>
                  <p className={`mt-3 ${t.bodyMuted}`}>{organizerSuggestion.description}</p>
                </div>
                <div className={`${t.panel} text-sm ${t.bodyMuted}`}>
                  <p>
                    <span className="text-slate-400">Best venue:</span> {organizerSuggestion.venue}
                  </p>
                  <p className="mt-2">
                    <span className="text-slate-400">Audience vibe:</span> {organizerSuggestion.vibe}
                  </p>
                  <p className="mt-2">
                    <span className="text-slate-400">Assistant venue style:</span>{" "}
                    {organizerAssistantCatalog[selectedOrganizer].venue}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <p data-testid="discovery-intro" className="text-center text-sm text-slate-400 lg:text-left">
              <span className="sr-only">Discovery assistants.</span>
              Discovery assistants combine a few scouts to narrow down events you might actually attend.
            </p>
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <section className={t.section}>
                <h2 className="text-2xl font-semibold">What you’re into</h2>
                <p className={`mt-2 text-sm ${t.bodyMuted}`}>
                  Jot down vibes or keywords; the assistants below use them as a mental model (demo uses sample events).
                </p>
                <textarea value={interests} onChange={(e) => setInterests(e.target.value)} className={`mt-4 ${t.textarea}`} />
                <h3 className={`mt-8 text-lg font-medium ${t.accent}`}>Turn on discovery assistants</h3>
                <p className={`mt-1 text-sm ${t.caption}`}>
                  Each one looks for different signals in event titles and descriptions.
                </p>
                <div className="mt-4 space-y-3">
                  {(
                    Object.entries(discoveryAssistantCatalog) as [
                      DiscoveryAssistantKey,
                      (typeof discoveryAssistantCatalog)[DiscoveryAssistantKey],
                    ][]
                  ).map(([key, agent]) => {
                    const active = subscribedDiscovery.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        data-testid={`discovery-assistant-${key}`}
                        onClick={() => toggleDiscovery(key)}
                        className={`w-full rounded-2xl border p-4 text-left ${
                          active ? t.cardSelectableActive : t.cardSelectableIdle
                        }`}
                      >
                        <p className={`text-sm ${t.accent}`}>{active ? "on" : "off"}</p>
                        <h4 className="mt-1 text-lg font-semibold">{agent.name}</h4>
                        <p className={`mt-2 text-sm ${t.bodyMuted}`}>{agent.summary}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className={t.section}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-semibold">Events that match</h2>
                  <span className={t.caption}>
                    {recommended.length} of {sampleDiscoverableEvents.length} sample events
                  </span>
                </div>
                <p className={`mt-2 text-sm ${t.caption}`}>
                  In a full product these rows would come from your community’s live calendar.
                </p>
                <div className="mt-6 space-y-4">
                  {recommended.length === 0 ? (
                    <p className={`rounded-2xl border border-white/10 bg-slate-900/50 p-6 ${t.bodyMuted}`}>
                      Turn on at least one assistant to see sample matches.
                    </p>
                  ) : (
                    recommended.map((event) => (
                      <div key={event.id} data-testid={`discovery-event-${event.id}`} className={t.panel}>
                        <p className={`text-sm ${t.accent}`}>{event.location}</p>
                        <h3 className="mt-1 text-2xl font-semibold">{event.title}</h3>
                        <p className={`mt-2 ${t.bodyMuted}`}>{event.description}</p>
                        <p className={`mt-3 text-sm ${t.caption}`}>{event.date}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
