const groups = [
  {
    name: "Sunday Hikes",
    members: 128,
    city: "Austin",
    nextEvent: "Trail walk at Zilker Park · Sat 10:00 AM",
  },
  {
    name: "Founders & Builders",
    members: 84,
    city: "Remote + NYC",
    nextEvent: "Coffee meetup · Tue 6:30 PM",
  },
  {
    name: "Board Game Night",
    members: 201,
    city: "Chicago",
    nextEvent: "Open game night · Fri 7:00 PM",
  },
];

const events = [
  {
    title: "Python for beginners",
    group: "Founders & Builders",
    date: "Apr 12 · 7:00 PM",
    location: "Virtual",
  },
  {
    title: "Sunset run",
    group: "Sunday Hikes",
    date: "Apr 13 · 6:00 PM",
    location: "Lady Bird Lake",
  },
  {
    title: "Game night",
    group: "Board Game Night",
    date: "Apr 14 · 7:30 PM",
    location: "Logan Square",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Bare bones meetup clone
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
                Find people, create events, and keep it dead simple.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
                This is the starter version: groups, events, RSVPs, and a clean
                discovery page. No bloated feed. No weird algorithm. Just enough
                to prove the idea.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 p-4 text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Groups</span>
                <strong className="text-white">3</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Upcoming events</span>
                <strong className="text-white">12</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>RSVPs this week</span>
                <strong className="text-white">91</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.name}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-6"
            >
              <p className="text-sm text-emerald-300">{group.city}</p>
              <h2 className="mt-2 text-2xl font-semibold">{group.name}</h2>
              <p className="mt-2 text-zinc-400">{group.members} members</p>
              <p className="mt-6 text-sm text-zinc-300">Next: {group.nextEvent}</p>
              <button className="mt-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950">
                Join group
              </button>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Upcoming events</h2>
              <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200">
                Create event
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {events.map((event) => (
                <div
                  key={event.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-zinc-400">{event.group}</p>
                    </div>
                    <div className="text-sm text-zinc-300">
                      <p>{event.date}</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950">
                      RSVP yes
                    </button>
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200">
                      Maybe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold">MVP checklist</h2>
            <ul className="mt-4 space-y-3 text-zinc-300">
              <li>• sign up / log in</li>
              <li>• create and join groups</li>
              <li>• create events</li>
              <li>• RSVP yes / no / maybe</li>
              <li>• browse by city or topic</li>
            </ul>
            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              Next step: wire this to a real database and a tiny auth flow.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
