import Link from "next/link";
import { createMessage, getEventsForGroup, getGroupById, getMessagesForGroup } from "@/lib/store";
import { gatherlyTheme as t } from "@/styles/theme";

async function sendMessage(formData: FormData) {
  "use server";
  const groupId = Number(formData.get("groupId"));
  const author = String(formData.get("author") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!groupId || !author || !body) return;
  createMessage({ groupId, author, body });
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groupId = Number(id);
  const group = getGroupById(groupId);
  if (!group) {
    return (
      <main className={`min-h-screen text-slate-100 ${t.page}`}>
        <div className="p-8">Group not found.</div>
      </main>
    );
  }

  const events = getEventsForGroup(groupId);
  const messages = getMessagesForGroup(groupId);

  return (
    <main className={`min-h-screen text-slate-100 ${t.page}`}>
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={t.pageHero}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={t.eyebrow}>{group.city}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">{group.name}</h1>
            </div>
            <Link href="/" className={t.navLink}>
              Back home
            </Link>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{group.description}</p>
          <p className={`mt-4 text-sm ${t.caption}`}>
            {group.members} members · {group.nextEvent}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className={t.section}>
            <h2 className="text-2xl font-semibold">Upcoming for this group</h2>
            <div className="mt-4 space-y-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className={t.panelSm}>
                    <p className={`text-sm ${t.accent}`}>{event.kind}</p>
                    <h3 className="mt-1 text-xl font-semibold">{event.title}</h3>
                    <p className={`mt-2 text-sm ${t.bodyMuted}`}>{event.description}</p>
                    <p className={`mt-3 text-sm ${t.caption}`}>
                      {event.dateLabel} · {event.location}
                    </p>
                  </div>
                ))
              ) : (
                <p className={t.caption}>No events yet.</p>
              )}
            </div>
          </section>

          <section className={t.section}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Community chat</h2>
              <span className={t.caption}>{messages.length} messages</span>
            </div>
            <form action={sendMessage} className="mt-4 space-y-3">
              <input type="hidden" name="groupId" value={group.id} />
              <input name="author" placeholder="Your name" className={t.input} />
              <textarea
                name="body"
                placeholder="Say hello, share an idea, or ask what people want next..."
                className={t.textareaShort}
              />
              <button type="submit" className={t.buttonPrimaryPill}>
                Send message
              </button>
            </form>
            <div className="mt-6 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={t.panelSm}>
                  <div className="flex items-center justify-between gap-3">
                    <p className={`font-medium ${t.accent}`}>{message.author}</p>
                    <p className="text-xs text-slate-500">{message.createdAt ?? "just now"}</p>
                  </div>
                  <p className={`mt-2 ${t.bodyMuted}`}>{message.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
