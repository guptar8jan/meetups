import Link from "next/link";
import { createMessage, getEventsForGroup, getGroupById, getMessagesForGroup } from "@/lib/store";

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

async function sendMessage(formData: FormData) {
  'use server';
  const groupId = Number(formData.get('groupId'));
  const author = String(formData.get('author') || '').trim();
  const body = String(formData.get('body') || '').trim();
  if (!groupId || !author || !body) return;
  createMessage({ groupId, author, body });
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groupId = Number(id);
  const group = getGroupById(groupId);
  if (!group) {
    return <main className={`min-h-screen text-slate-100 ${theme.page}`}><div className="p-8">Group not found.</div></main>;
  }

  const events = getEventsForGroup(groupId);
  const messages = getMessagesForGroup(groupId);

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>{group.city}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">{group.name}</h1>
            </div>
            <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">
              Back home
            </Link>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{group.description}</p>
          <p className="mt-4 text-sm text-slate-400">{group.members} members · {group.nextEvent}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Upcoming for this group</h2>
            <div className="mt-4 space-y-3">
              {events.length > 0 ? events.map((event) => (
                <div key={event.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-sm text-cyan-300">{event.kind}</p>
                  <h3 className="mt-1 text-xl font-semibold">{event.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{event.description}</p>
                  <p className="mt-3 text-sm text-slate-400">{event.dateLabel} · {event.location}</p>
                </div>
              )) : <p className="text-slate-400">No events yet.</p>}
            </div>
          </section>

          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Community chat</h2>
              <span className="text-sm text-slate-400">{messages.length} messages</span>
            </div>
            <form action={sendMessage} className="mt-4 space-y-3">
              <input type="hidden" name="groupId" value={group.id} />
              <input name="author" placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <textarea name="body" placeholder="Say hello, share an idea, or ask what people want next..." className="h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="submit" className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-100`}>Send message</button>
            </form>
            <div className="mt-6 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-cyan-300">{message.author}</p>
                    <p className="text-xs text-slate-500">{message.createdAt ?? 'just now'}</p>
                  </div>
                  <p className="mt-2 text-slate-300">{message.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
