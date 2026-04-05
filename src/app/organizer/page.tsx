"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const flavors = [
  "social host",
  "tech meetup planner",
  "coffee chat curator",
  "demo night organizer",
  "after-work happy hour planner",
  "hackathon host",
];

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function OrganizerPage() {
  const router = useRouter();
  const [groupPrompt, setGroupPrompt] = useState("something for frontend engineers who like coffee");
  const [groupCity, setGroupCity] = useState("Austin");
  const [groupFlavor, setGroupFlavor] = useState("coffee chat curator");
  const [eventPrompt, setEventPrompt] = useState("a relaxed demo night for AI builders");
  const [eventDate, setEventDate] = useState("Apr 20 · 7:00 PM");
  const [eventLocation, setEventLocation] = useState("East Austin");
  const [eventFlavor, setEventFlavor] = useState("demo night organizer");
  const [status, setStatus] = useState<string>("");

  async function createGroup() {
    setStatus("Creating group...");
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: groupPrompt, city: groupCity, flavor: groupFlavor }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus(data.error || 'Failed to create group');
      return;
    }
    setStatus(`Created group: ${data.name}`);
    router.refresh();
  }

  async function createEvent() {
    setStatus("Creating event...");
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: eventPrompt, dateLabel: eventDate, location: eventLocation, flavor: eventFlavor }),
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
                Create real groups and events from prompts.
              </h1>
            </div>
            <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">
              Back to Gatherly
            </Link>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            REST APIs only now. No server actions.
          </p>
          {status ? <p className="mt-4 text-sm text-cyan-300">{status}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section data-testid="create-group-form" className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Create a group</h2>
            <div className="mt-4 space-y-3">
              <select value={groupFlavor} onChange={(e) => setGroupFlavor(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100">
                {flavors.map((flavor) => <option key={flavor} value={flavor}>{flavor}</option>)}
              </select>
              <input value={groupPrompt} onChange={(e) => setGroupPrompt(e.target.value)} placeholder="something for frontend engineers who like coffee" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={groupCity} onChange={(e) => setGroupCity(e.target.value)} placeholder="Austin" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="button" onClick={createGroup} className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>
                Create group
              </button>
            </div>
          </section>

          <section data-testid="create-event-form" className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Create an event</h2>
            <div className="mt-4 space-y-3">
              <select value={eventFlavor} onChange={(e) => setEventFlavor(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100">
                {flavors.map((flavor) => <option key={flavor} value={flavor}>{flavor}</option>)}
              </select>
              <input value={eventPrompt} onChange={(e) => setEventPrompt(e.target.value)} placeholder="a relaxed demo night for AI builders" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Apr 20 · 7:00 PM" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="East Austin" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="button" onClick={createEvent} className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>
                Create event
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
