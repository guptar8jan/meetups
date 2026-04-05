export type OrganizerAssistantKey =
  | "conversation-curator"
  | "showcase-organizer"
  | "sprint-host"
  | "social-planner"
  | "talk-producer"
  | "welcome-guide";

export const organizerAssistantCatalog: Record<
  OrganizerAssistantKey,
  { name: string; tone: string; summary: string; sampleTitle: string; venue: string }
> = {
  "conversation-curator": {
    name: "Conversation Curator",
    tone: "casual",
    summary: "Suggests warm, low-pressure gatherings centered around conversation and connection.",
    sampleTitle: "Coffee & Conversation",
    venue: "cafe or lounge",
  },
  "showcase-organizer": {
    name: "Showcase Organizer",
    tone: "spotlight",
    summary: "Creates event ideas built around sharing work, storytelling, and public demos.",
    sampleTitle: "Showcase Night",
    venue: "community venue or studio",
  },
  "sprint-host": {
    name: "Sprint Host",
    tone: "high-energy",
    summary: "Designs collaborative, time-boxed gatherings that help people build together quickly.",
    sampleTitle: "Idea Sprint Night",
    venue: "coworking venue",
  },
  "social-planner": {
    name: "Social Planner",
    tone: "social",
    summary: "Generates relaxed gatherings for people who want to meet in an easy, welcoming setting.",
    sampleTitle: "After Hours Mixer",
    venue: "bar, patio, or cafe",
  },
  "talk-producer": {
    name: "Talk Producer",
    tone: "structured",
    summary: "Creates polished event concepts that feel thoughtful, informative, and worth attending.",
    sampleTitle: "Stories & Ideas",
    venue: "auditorium or event room",
  },
  "welcome-guide": {
    name: "Welcome Guide",
    tone: "welcoming",
    summary: "Designs beginner-friendly gatherings that help new people feel included and comfortable.",
    sampleTitle: "First Time Here Club",
    venue: "library room or community center",
  },
};

export function generateOrganizerSuggestion(agent: OrganizerAssistantKey, prompt: string) {
  const normalized = prompt.toLowerCase();
  const preset = organizerAssistantCatalog[agent];

  if (agent === "conversation-curator" && normalized.includes("coffee")) {
    return {
      title: "Coffee & Conversation",
      description: "A relaxed gathering for people who want good drinks, easy conversation, and a shared interest.",
      venue: "indie coffee shop",
      vibe: "friendly, chatty, low-key",
    };
  }

  if (
    agent === "showcase-organizer" &&
    (normalized.includes("ideas") ||
      normalized.includes("creative") ||
      normalized.includes("share") ||
      normalized.includes("neighbor"))
  ) {
    return {
      title: "Showcase Night",
      description: "A community showcase where people share projects, stories, and works in progress.",
      venue: "community venue",
      vibe: "expressive, open, inspiring",
    };
  }

  if (agent === "sprint-host") {
    return {
      title: "Idea Sprint Night",
      description: "A collaborative event where people team up quickly and turn ideas into something tangible.",
      venue: "coworking space",
      vibe: "energetic, collaborative, fast-moving",
    };
  }

  return {
    title: preset.sampleTitle,
    description: `A ${preset.tone} event inspired by: ${prompt}`,
    venue: preset.venue,
    vibe: `${preset.tone}, community-driven, welcoming`,
  };
}

export type DiscoveryAssistantKey =
  | "social-scout"
  | "showcase-finder"
  | "sprint-radar"
  | "after-hours-finder"
  | "welcome-guide"
  | "neighborhood-scout";

export const discoveryAssistantCatalog: Record<
  DiscoveryAssistantKey,
  { name: string; matches: string[]; summary: string }
> = {
  "social-scout": {
    name: "Social Scout",
    matches: ["coffee", "conversation", "social", "mixer", "gathering", "brunch", "porch"],
    summary: "Surfaces casual meetups and low-key socials so you can drop in without a big plan.",
  },
  "showcase-finder": {
    name: "Showcase Finder",
    matches: ["showcase", "demo", "story", "share", "creative", "talent", "open mic"],
    summary: "Highlights nights where people share work, stories, performances, or passion projects.",
  },
  "sprint-radar": {
    name: "Sprint Radar",
    matches: ["sprint", "build", "prototype", "hackathon", "collaborative", "make", "workshop"],
    summary: "Finds hands-on sessions where groups build or learn something together quickly.",
  },
  "after-hours-finder": {
    name: "After-Hours Finder",
    matches: ["happy hour", "after hours", "dinner", "casual", "evening", "mixer", "pub"],
    summary: "Points you to relaxed evening hangouts—food, drinks, and easy conversation.",
  },
  "welcome-guide": {
    name: "Welcome Guide",
    matches: ["beginner", "intro", "welcome", "friendly", "first time", "all levels", "support"],
    summary: "Prioritizes events that feel approachable for newcomers and first-timers.",
  },
  "neighborhood-scout": {
    name: "Neighborhood Scout",
    matches: ["block", "neighborhood", "potluck", "park", "farmers", "cleanup", "volunteer", "local"],
    summary: "Spots block parties, park meetups, potlucks, and civic or volunteer gatherings nearby.",
  },
};

export type DiscoverableEvent = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
};

export const sampleDiscoverableEvents: DiscoverableEvent[] = [
  {
    id: 1,
    title: "Saturday porch coffee",
    description: "Bring a mug; neighbors gather on the porch for pastries and easy morning chat.",
    location: "Maple Street",
    date: "Apr 12 · 10:00 AM",
  },
  {
    id: 2,
    title: "Spring block potluck",
    description: "BYO dish to share; meet folks from the block and label allergens on the table.",
    location: "Oak Street green",
    date: "Apr 13 · 6:00 PM",
  },
  {
    id: 3,
    title: "Idea Sprint Night",
    description: "A collaborative session for turning ideas into something tangible together.",
    location: "Community center",
    date: "Apr 23 · 6:30 PM",
  },
  {
    id: 4,
    title: "Welcome Workshop",
    description: "A beginner-friendly session with a calm pace, clear steps, and lots of support.",
    location: "Library hall",
    date: "Apr 24 · 5:30 PM",
  },
  {
    id: 5,
    title: "Park cleanup & picnic",
    description: "Volunteer for an hour, then stay for sandwiches and lawn games—kids welcome.",
    location: "Riverside Park",
    date: "Apr 27 · 9:00 AM",
  },
];

export function recommendEventsForAgents(
  subscribed: DiscoveryAssistantKey[],
  events: DiscoverableEvent[] = sampleDiscoverableEvents
): DiscoverableEvent[] {
  return events.filter((event) => {
    const haystack = `${event.title} ${event.description}`.toLowerCase();
    return subscribed.some((key) =>
      discoveryAssistantCatalog[key].matches.some((term) => haystack.includes(term))
    );
  });
}
