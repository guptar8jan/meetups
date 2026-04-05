"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { gatherlyTheme as t } from "@/styles/theme";

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
    title: "Coffee & conversation mornings",
    description: "A low-pressure social gathering for people who want to meet, chat, and start the day well.",
    tag: "social",
    votes: 14,
  },
  {
    id: 2,
    title: "Community showcase night",
    description: "An evening where people can share projects, stories, performances, or works in progress.",
    tag: "showcase",
    votes: 21,
  },
  {
    id: 3,
    title: "Weekend idea sprint",
    description: "A one-day collaborative session for turning ideas into something real with other people.",
    tag: "collaboration",
    votes: 17,
  },
];

export default function CommunityPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("general");

  const trending = useMemo(() => [...ideas].sort((a, b) => b.votes - a.votes), [ideas]);

  function upvote(id: number) {
    setIdeas((current) => current.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea)));
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
        tag: tag.trim() || "general",
        votes: 1,
      },
      ...current,
    ]);

    setTitle("");
    setDescription("");
    setTag("general");
  }

  function onSubmitIdea(e: FormEvent) {
    e.preventDefault();
    submitIdea();
  }

  return (
    <main className={`min-h-screen text-slate-100 ${t.page}`}>
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className={t.pageHero}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={t.eyebrow}>Community</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
                Organizer ideas and community voting.
              </h1>
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
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Organizers can post ideas for future gatherings, and the community can vote on what sounds most exciting.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={t.section}>
            <h2 className="text-2xl font-semibold">Post an organizer idea</h2>
            <form className="mt-4 space-y-3" onSubmit={onSubmitIdea}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What should we host next?"
                className={t.input}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the format, audience, or vibe..."
                className={t.textarea}
              />
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="social / learning / showcase / collaboration"
                className={t.input}
              />
              <button type="submit" className={t.buttonPrimaryPill}>
                Post idea
              </button>
            </form>
          </section>

          <section className={t.section}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Ideas gaining traction</h2>
              <span className={t.caption}>{ideas.length} ideas</span>
            </div>
            <div className="mt-6 space-y-4">
              {trending.map((idea) => (
                <div key={idea.id} className={t.panel}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm ${t.accent}`}>{idea.tag} · posted by organizer</p>
                      <h3 className="mt-1 text-2xl font-semibold">{idea.title}</h3>
                    </div>
                    <span className={t.badgeMuted}>{idea.votes} votes</span>
                  </div>
                  <p className={`mt-3 ${t.bodyMuted}`}>{idea.description}</p>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => upvote(idea.id)} className={t.buttonPrimaryPill}>
                      I’m interested
                    </button>
                    <button type="button" className={t.buttonOutline}>
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
