import Link from "next/link";
import { getEvents, getGroups } from "@/lib/store";
import { gatherlyTheme as t } from "@/styles/theme";

export default function Home() {
  const groups = getGroups();
  const events = getEvents();

  return (
    <main className={`min-h-screen text-slate-100 ${t.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={t.homeHero}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={t.eyebrow}>Gatherly</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                A place to discover, host, and grow communities.
              </h1>
            </div>
            <div className="flex gap-3">
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
            Create groups, host events, gather feedback, and help people find experiences they actually want to attend.
          </p>
        </div>

        <section className={t.section}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming events</h2>
            <span className={t.caption}>{events.length} live events</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className={t.cardNested}>
                <p className={`text-sm ${t.accent}`}>{event.groupName}</p>
                <h3 className="mt-1 text-xl font-semibold">{event.title}</h3>
                <p className={`mt-2 text-sm ${t.bodyMuted}`}>{event.description}</p>
                <div className={`mt-4 text-sm ${t.caption}`}>
                  <p>{event.dateLabel}</p>
                  <p>{event.location}</p>
                  <p className="mt-1 capitalize">{event.kind}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={t.section}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Groups & communities</h2>
            <span className={t.caption}>{groups.length} live groups</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <article key={group.id} className={t.cardNested}>
                <p className={`text-sm ${t.accent}`}>{group.city}</p>
                <Link href={`/groups/${group.id}`} className="mt-1 block text-xl font-semibold hover:text-cyan-300">
                  {group.name}
                </Link>
                <p className={`mt-2 text-sm ${t.bodyMuted}`}>{group.description}</p>
                <div className={`mt-4 text-sm ${t.caption}`}>
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
