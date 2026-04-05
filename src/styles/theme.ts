/**
 * Gatherly design tokens — Tailwind utility strings used across routes.
 * Keeps the slate + cyan shell consistent and makes refactors one-touch.
 */

const cardFill = "border-white/10 bg-white/5 shadow-xl shadow-black/20";

export const gatherlyTheme = {
  /** Full-page gradient background (pair with min-h-screen text-slate-100 on <main>). */
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",

  /** Glass card fill — wrap with your own rounded-* border p-* */
  card: cardFill,

  /** Home hero only: blur + rounded container + card fill */
  homeHero: `rounded-3xl border p-8 backdrop-blur ${cardFill}`,

  /** Standard inner pages: large rounded header card */
  pageHero: `rounded-3xl border p-8 ${cardFill}`,

  /** Section panels: rounded-2xl + padding + card fill */
  section: `rounded-2xl border p-6 ${cardFill}`,

  accent: "text-cyan-300",
  eyebrow: "text-sm uppercase tracking-[0.3em] text-cyan-300",

  /** Primary CTA (cyan) — add rounded-full + padding if needed, or use buttonPrimaryPill */
  buttonPrimary: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
  buttonPrimaryPill: "rounded-full px-4 py-2 text-sm font-semibold bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",

  /** Muted header nav links */
  navLink: "rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100",

  /** “Back to Gatherly” and similar */
  backLink: "shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 hover:bg-white/5",
  backLinkInline: "inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 hover:bg-white/5",

  /** Role tabs (Assistants page) */
  roleTabActive:
    "rounded-full px-5 py-2.5 text-sm font-semibold transition bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20",
  roleTabInactive:
    "rounded-full px-5 py-2.5 text-sm font-semibold transition border border-white/15 text-slate-200 hover:border-white/25",

  input: "w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100",
  textarea: "h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100",
  textareaShort: "h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100",
  select: "w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100",

  panel: "rounded-2xl border border-white/10 bg-slate-900/50 p-5",
  panelSm: "rounded-xl border border-white/10 bg-slate-900/50 p-4",

  badgeMuted: "rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300",
  badgeAccentPill: "rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100",
  caption: "text-sm text-slate-400",
  bodyMuted: "text-slate-300",

  /** Secondary row button (outline) */
  buttonOutline: "rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100",

  /** Assistant / discovery cards */
  cardSelectableActive: "border-cyan-400/50 bg-cyan-400/10",
  cardSelectableIdle: "border-white/10 bg-slate-900/50",

  /** Nested tile inside a section (home events / groups grid) */
  cardNested: "rounded-xl border border-white/10 bg-white/5 p-4",
} as const;

/** Discord-adjacent layout for /chat */
export const chatTheme = {
  sidebar: "bg-[#1e1f22] border-r border-black/50",
  main: "bg-[#313338]",
  header: "border-b border-black/40 shadow-sm",
  composer: "border-t border-black/40 bg-[#2b2d31]",
  pill: "text-[11px] font-semibold uppercase tracking-wide text-slate-400",
  channelActive: "bg-[#404249] text-white",
  channelIdle: "text-slate-300 hover:bg-white/5",
  inputSidebar: "mt-2 w-full rounded border border-white/10 bg-[#2b2d31] px-2 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50",
  composerTextarea:
    "min-h-[44px] flex-1 resize-y rounded-lg border border-black/40 bg-[#383a40] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40",
  sendButton: "self-end rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow disabled:opacity-40",
  eventIdeaBadge: "rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-cyan-200",
} as const;
