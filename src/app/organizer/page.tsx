"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const styles = [
  "social host",
  "learning guide",
  "community planner",
  "showcase organizer",
  "after-hours host",
  "workshop curator",
];

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function OrganizerPage() {
  const router = useRouter();
  const [groupPrompt, setGroupPrompt] = useState("a welcoming social group for people who enjoy coffee and conversation");
  const [groupCity, setGroupCity] = useState("Austin");
  const [groupStyle, setGroupStyle] = useState("community planner");
  const [eventPrompt, setEventPrompt] = useState("a relaxed evening event for creative people to meet and share ideas");
  const [eventDate, setEventDate] = useState("Apr 20 · 7:00 PM");
  const [eventLocation, setEventLocation] = useState("East Austin");
  const [eventStyle, setEventStyle] = useState("social host");
  const [status, setStatus] = useState<string>("");

  async function createGroup(e?: FormEvent) {
    e?.preventDefault();
    setStatus("Creating group...");
    const res = await fetch("/api/groups", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: groupPrompt, city: groupCity, flavor: groupStyle }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus(data.error || 'Failed to create group');
      return;
    }
    setStatus(`Created group: ${data.name}`);
    router.refresh();
  }

  async function createEvent(e?: FormEvent) {
    e?.preventDefault();
    setStatus("Creating event...");
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: eventPrompt, dateLabel: eventDate, location: eventLocation, flavor: eventStyle }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus(data.error || 'Failed to create event');
      return;
    }
    setStatus(`Created event: ${data.title}`);
    router.refresh();
  }

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>Organizer</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Create groups and events from simple prompts.
              </h1>
            </div>
            <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">
              Back to Gatherly
            </Link>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Use planning styles and prompts to launch communities and experiences people can join.
          </p>
          {status ? <p className="mt-4 text-sm text-cyan-300">{status}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section data-testid="create-group-form" className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Create a group</h2>
            <form className="mt-4 space-y-3" onSubmit={(e) => void createGroup(e)}>
              <select value={groupStyle} onChange={(e) => setGroupStyle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100">
                {styles.map((style) => <option key={style} value={style}>{style}</option>)}
              </select>
              <input value={groupPrompt} onChange={(e) => setGroupPrompt(e.target.value)} placeholder="a welcoming social group for people who enjoy coffee and conversation" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={groupCity} onChange={(e) => setGroupCity(e.target.value)} placeholder="Austin" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="submit" className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-100`}>
                Create group
              </button>
            </form>
          </section>

          <section data-testid="create-event-form" className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Create an event</h2>
            <form className="mt-4 space-y-3" onSubmit={(e) => void createEvent(e)}>
              <select value={eventStyle} onChange={(e) => setEventStyle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100">
                {styles.map((style) => <option key={style} value={style}>{style}</option>)}
              </select>
              <input value={eventPrompt} onChange={(e) => setEventPrompt(e.target.value)} placeholder="a relaxed evening event for creative people to meet and share ideas" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Apr 20 · 7:00 PM" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="East Austin" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="submit" className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-100`}>
                Create event
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
