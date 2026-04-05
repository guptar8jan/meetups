import Link from "next/link";
import { getEvents, getGroups } from "@/lib/store";

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function Home() {
  const groups = getGroups();
  const events = getEvents();

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 backdrop-blur ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>Gatherly</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                A place to discover, host, and grow communities.
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
            Create groups, host events, gather feedback, and help people find experiences they actually want to attend.
          </p>
        </div>

        <section className={`rounded-2xl border p-6 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming events</h2>
            <span className="text-sm text-slate-400">{events.length} live events</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-cyan-300">{event.groupName}</p>
                <h3 className="mt-1 text-xl font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{event.description}</p>
                <div className="mt-4 text-sm text-slate-400">
                  <p>{event.dateLabel}</p>
                  <p>{event.location}</p>
                  <p className="mt-1 capitalize">{event.kind}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border p-6 ${theme.card}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Groups & communities</h2>
            <span className="text-sm text-slate-400">{groups.length} live groups</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <article key={group.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-cyan-300">{group.city}</p>
                <Link href={`/groups/${group.id}`} className="mt-1 block text-xl font-semibold hover:text-cyan-300">{group.name}</Link>
                <p className="mt-2 text-sm text-slate-300">{group.description}</p>
                <div className="mt-4 text-sm text-slate-400">
                  <p>{group.members} members</p>
                  <p>{group.nextEvent ?? "No event yet"}</p>
                  {group.agentFlavor ? <p className="mt-1 capitalize">Planning style: {group.agentFlavor}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
