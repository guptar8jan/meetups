"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatTheme as c, gatherlyTheme as g } from "@/styles/theme";

type ChatMessage = {
  id: number;
  channel: string;
  author: string;
  body: string;
  createdAt: string | null;
};

const CHANNELS: { id: string; label: string; description: string }[] = [
  { id: "lounge", label: "the-lounge", description: "Hang out, meet people, casual chatter" },
  { id: "event-ideas", label: "event-suggestions", description: "Pitch gatherings you want to see happen" },
  { id: "introductions", label: "introductions", description: "Say who you are and what you’re into" },
];

const DISPLAY_KEY = "gatherly-chat-display-name";

function avatarHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h + name.charCodeAt(i) * 17) % 360;
  return h;
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function ChatPage() {
  const [channel, setChannel] = useState("lounge");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(DISPLAY_KEY);
    if (stored?.trim()) {
      setDisplayName(stored.trim().slice(0, 40));
      return;
    }
    const guest = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(DISPLAY_KEY, guest);
    setDisplayName(guest);
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/chat?channel=${encodeURIComponent(channel)}`);
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Could not load messages");
      return;
    }
    setError(null);
    setMessages(data.messages as ChatMessage[]);
  }, [channel]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const pollId = window.setInterval(() => void loadMessages(), 4000);
    return () => window.clearInterval(pollId);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, channel]);

  const activeMeta = useMemo(() => CHANNELS.find((c) => c.id === channel), [channel]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    const author = displayName.trim();
    if (!body || !author || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ channel, author, body }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Send failed");
        return;
      }
      setDraft("");
      await loadMessages();
    } finally {
      setSending(false);
    }
  }

  function saveDisplayName(next: string) {
    const t = next.trim().slice(0, 40);
    if (!t) return;
    localStorage.setItem(DISPLAY_KEY, t);
    setDisplayName(t);
  }

  return (
    <div className="flex min-h-screen text-slate-100">
      <aside className={`flex w-full max-w-[260px] shrink-0 flex-col ${c.sidebar}`}>
        <div className="border-b border-black/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Gatherly</p>
          <h1 className="mt-1 text-lg font-bold text-white">Chat</h1>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">Mingle and suggest events — Discord-style channels.</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Channels">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              data-testid={`chat-channel-${ch.id}`}
              onClick={() => setChannel(ch.id)}
              className={`flex w-full flex-col items-start rounded-md px-2 py-2 text-left transition ${
                channel === ch.id ? c.channelActive : c.channelIdle
              }`}
            >
              <span className="font-medium">
                <span className="text-slate-500">#</span> {ch.label}
              </span>
              <span className="mt-0.5 text-[11px] leading-snug text-slate-500">{ch.description}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-black/40 p-3">
          <p className={c.pill}>Display name</p>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => saveDisplayName(displayName)}
            className={c.inputSidebar}
            placeholder="How you appear in chat"
            maxLength={40}
          />
        </div>
        <div className="border-t border-black/40 p-3">
          <Link href="/" className={g.backLinkInline}>
            Back to Gatherly
          </Link>
          <Link href="/community" className="mt-2 block text-xs text-slate-500 hover:text-slate-300">
            Community ideas
          </Link>
        </div>
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${c.main}`}>
        <header className={`flex items-center justify-between gap-3 px-4 py-3 ${c.header}`}>
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-slate-500">#</span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">{activeMeta?.label ?? channel}</h2>
              <p className="text-xs text-slate-400">{activeMeta?.description}</p>
            </div>
          </div>
          <Link href="/" className={g.backLink}>
            Back to Gatherly
          </Link>
        </header>

        {error ? (
          <p className="mx-4 mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" data-testid="chat-message-list">
          {messages.map((m) => {
            const hue = avatarHue(m.author);
            const initials = m.author
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "?";
            const isIdea =
              /^\[event\]/i.test(m.body) || /^\[idea\]/i.test(m.body) || /^\/suggest\b/i.test(m.body);
            return (
              <div key={m.id} className="flex gap-3" data-testid={`chat-message-${m.id}`}>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner"
                  style={{ background: `hsl(${hue} 42% 42%)` }}
                  aria-hidden
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span className="font-semibold text-white">{m.author}</span>
                    <time className="text-[11px] text-slate-500">{formatTime(m.createdAt)}</time>
                    {isIdea ? <span className={c.eventIdeaBadge}>event idea</span> : null}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-200">
                    {m.body}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className={`p-4 ${c.composer}`}>
          <p className="mb-2 text-[11px] text-slate-500">
            Tip: start with <kbd className="rounded bg-black/30 px-1">[event]</kbd> or{" "}
            <kbd className="rounded bg-black/30 px-1">/suggest</kbd> to highlight an event pitch.
          </p>
          <div className="flex gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message #${activeMeta?.label ?? "channel"}`}
              rows={2}
              maxLength={2000}
              data-testid="chat-composer"
              className={c.composerTextarea}
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className={c.sendButton}
            >
              {sending ? "…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
