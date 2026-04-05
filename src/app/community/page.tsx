"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Idea = {
  id: number;
  title: string;
  description: string;
  tag: string;
  votes: number;
};

const initialIdeas: Idea[] = [
  {
    id: 1,
    title: "Frontend coffee chats",
    description: "A low-pressure meetup for frontend engineers who want to talk UI, React, and side projects over coffee.",
    tag: "frontend",
    votes: 14,
  },
  {
    id: 2,
    title: "AI demo night",
    description: "A casual evening where builders show AI tools, agents, prototypes, and weird side projects.",
    tag: "ai",
    votes: 21,
  },
  {
    id: 3,
    title: "Weekend mini hackathon",
    description: "A one-day sprint for shipping scrappy prototypes with small teams and demos at the end.",
    tag: "hackathon",
    votes: 17,
  },
];

const theme = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  card: "border-white/10 bg-white/5 shadow-xl shadow-black/20",
  accent: "text-cyan-300",
  button: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
};

export default function CommunityPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("general");

  const trending = useMemo(() => [...ideas].sort((a, b) => b.votes - a.votes), [ideas]);

  function upvote(id: number) {
    setIdeas((current) => current.map((idea) => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
  }

  function submitIdea() {
    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();
    if (!cleanedTitle || !cleanedDescription) return;

    setIdeas((current) => [
      {
        id: Date.now(),
        title: cleanedTitle,
        description: cleanedDescription,
        tag: tag.trim() || 'general',
        votes: 1,
      },
      ...current,
    ]);

    setTitle("");
    setDescription("");
    setTag("general");
  }

  return (
    <main className={`min-h-screen text-slate-100 ${theme.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={`rounded-3xl border p-8 ${theme.card}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accent}`}>Community</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Community chatter and upvoted ideas.
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Home</Link>
              <Link href="/organizer" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">Organizer</Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Share ideas for events, upvote what sounds fun, and let the best concepts rise to the top.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <h2 className="text-2xl font-semibold">Post an idea</h2>
            <div className="mt-4 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What should we host next?" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the vibe, audience, or format..." className="h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="frontend / ai / social / hackathon" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100" />
              <button type="button" onClick={submitIdea} className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>
                Post idea
              </button>
            </div>
          </section>

          <section className={`rounded-2xl border p-6 ${theme.card}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Trending ideas</h2>
              <span className="text-sm text-slate-400">{ideas.length} ideas</span>
            </div>
            <div className="mt-6 space-y-4">
              {trending.map((idea) => (
                <div key={idea.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-cyan-300">{idea.tag}</p>
                      <h3 className="mt-1 text-2xl font-semibold">{idea.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
                      {idea.votes} votes
                    </span>
                  </div>
                  <p className="mt-3 text-slate-300">{idea.description}</p>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => upvote(idea.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>
                      I’m interested
                    </button>
                    <button type="button" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">
                      Turn into event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
