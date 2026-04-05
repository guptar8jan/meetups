import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type Group = {
  id: number;
  name: string;
  city: string;
  description: string;
  members: number;
  nextEvent: string | null;
  agentFlavor: string | null;
};

export type Event = {
  id: number;
  groupId: number;
  groupName: string;
  title: string;
  dateLabel: string;
  location: string;
  description: string;
  kind: string;
};

export type Message = {
  id: number;
  groupId: number;
  author: string;
  body: string;
  createdAt: string | null;
};

export type ChatMessage = {
  id: number;
  channel: string;
  author: string;
  body: string;
  createdAt: string | null;
};

/** Public lounge channels (Discord-style server rooms). */
export const CHAT_CHANNELS = ["lounge", "event-ideas", "introductions"] as const;
export type ChatChannel = (typeof CHAT_CHANNELS)[number];

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "meetups.sqlite");

function getDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      members INTEGER NOT NULL DEFAULT 0,
      next_event TEXT NOT NULL DEFAULT 'No event scheduled yet',
      agent_flavor TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      date_label TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      kind TEXT NOT NULL DEFAULT 'meetup',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel TEXT NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel);
  `);

  const groupColumns = db.prepare("PRAGMA table_info(groups)").all() as { name: string }[];
  if (!groupColumns.some((column) => column.name === "description")) db.exec("ALTER TABLE groups ADD COLUMN description TEXT NOT NULL DEFAULT ''");
  if (!groupColumns.some((column) => column.name === "next_event")) db.exec("ALTER TABLE groups ADD COLUMN next_event TEXT NOT NULL DEFAULT 'No event scheduled yet'");
  if (!groupColumns.some((column) => column.name === "agent_flavor")) db.exec("ALTER TABLE groups ADD COLUMN agent_flavor TEXT");
  if (!groupColumns.some((column) => column.name === "created_at")) db.exec("ALTER TABLE groups ADD COLUMN created_at TEXT");

  const eventColumns = db.prepare("PRAGMA table_info(events)").all() as { name: string }[];
  if (eventColumns.length > 0) {
    if (!eventColumns.some((column) => column.name === "description")) db.exec("ALTER TABLE events ADD COLUMN description TEXT NOT NULL DEFAULT ''");
    if (!eventColumns.some((column) => column.name === "kind")) db.exec("ALTER TABLE events ADD COLUMN kind TEXT NOT NULL DEFAULT 'meetup'");
    if (!eventColumns.some((column) => column.name === "created_at")) db.exec("ALTER TABLE events ADD COLUMN created_at TEXT");
  }

  seedIfEmpty(db);
  seedChatIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Database) {
  const row = db.prepare("SELECT COUNT(*) as count FROM groups").get() as { count: number };
  if (row.count > 0) return;

  const insertGroup = db.prepare(
    "INSERT INTO groups (name, city, description, members, next_event, agent_flavor) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const social = insertGroup.run(
    "Neighborhood Coffee Circle",
    "Riverside",
    "Neighbors who drop in for morning coffee, light conversation, and a friendly regular rhythm.",
    48,
    "Saturday porch coffee · Apr 12 · 10:00 AM",
    "community planner"
  );

  const showcase = insertGroup.run(
    "Block Association Social",
    "Oakdale",
    "Residents planning potlucks, holiday lights, clean-up days, and other block-wide get-togethers.",
    62,
    "Spring block potluck · Apr 13 · 6:00 PM",
    "showcase organizer"
  );

  const insertEvent = db.prepare(
    "INSERT INTO events (group_id, title, date_label, location, description, kind) VALUES (?, ?, ?, ?, ?, ?)"
  );

  insertEvent.run(
    Number(social.lastInsertRowid),
    "Saturday porch coffee",
    "Apr 12 · 10:00 AM",
    "Front porch & folding chairs on Maple Street",
    "Bring a mug; we’ll have a carafe and pastries. Kids welcome, no agenda—just hello.",
    "social"
  );

  insertEvent.run(
    Number(showcase.lastInsertRowid),
    "Spring block potluck",
    "Apr 13 · 6:00 PM",
    "Cul-de-sac tables",
    "BYO dish to share; we’ll set up tables, name tags, and a simple cleanup crew afterward.",
    "potluck"
  );

  const insertMessage = db.prepare("INSERT INTO messages (group_id, author, body) VALUES (?, ?, ?)");
  insertMessage.run(Number(social.lastInsertRowid), "Ava", "Could we add a rain date if the weather turns?");
  insertMessage.run(Number(social.lastInsertRowid), "Noah", "Happy to bring extra chairs if people RSVP in the thread.");
  insertMessage.run(Number(showcase.lastInsertRowid), "Maya", "Let’s label allergens on the potluck table this time.");
}

function seedChatIfEmpty(db: Database) {
  const row = db.prepare("SELECT COUNT(*) as count FROM chat_messages").get() as { count: number };
  if (row.count > 0) return;

  const insert = db.prepare("INSERT INTO chat_messages (channel, author, body) VALUES (?, ?, ?)");
  insert.run(
    "lounge",
    "Gatherly",
    "Welcome to the lounge. Say hi, find people near you, and keep things kind."
  );
  insert.run("lounge", "RiverPat", "Anyone up for a Saturday walk-and-talk after porch coffee?");
  insert.run(
    "event-ideas",
    "Gatherly",
    "Drop events you’d actually attend — organizers and hosts often read this channel."
  );
  insert.run(
    "event-ideas",
    "OakdaleFan",
    "Monthly skill-share night? 20-minute demos + potluck snacks. Who’s in?"
  );
  insert.run(
    "introductions",
    "Gatherly",
    "New here? Share your neighborhood, what you like to do, and what you’re hoping to find."
  );
  insert.run("introductions", "Mira", "Hi from Oakdale — into gardening swaps and low-key block parties.");
}

export function findGroupByName(name: string): Group | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, name, city, description, members, next_event as nextEvent, agent_flavor as agentFlavor FROM groups WHERE name = ?"
    )
    .get(name) as Group | undefined;
  return row ?? null;
}

export function getGroups(): Group[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, name, city, description, members, next_event as nextEvent, agent_flavor as agentFlavor FROM groups ORDER BY id DESC"
    )
    .all() as Group[];
}

export function getGroupById(id: number): Group | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, name, city, description, members, next_event as nextEvent, agent_flavor as agentFlavor FROM groups WHERE id = ?"
    )
    .get(id) as Group | undefined;
  return row ?? null;
}

export function getEvents(): Event[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT e.id, e.group_id as groupId, g.name as groupName, e.title, e.date_label as dateLabel, e.location,
              e.description, e.kind
       FROM events e
       JOIN groups g ON g.id = e.group_id
       ORDER BY e.id DESC`)
    .all() as Event[];
}

export function getEventsForGroup(groupId: number): Event[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT e.id, e.group_id as groupId, g.name as groupName, e.title, e.date_label as dateLabel, e.location,
              e.description, e.kind
       FROM events e
       JOIN groups g ON g.id = e.group_id
       WHERE e.group_id = ?
       ORDER BY e.id DESC`)
    .all(groupId) as Event[];
}

export function getMessagesForGroup(groupId: number): Message[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, group_id as groupId, author, body, created_at as createdAt FROM messages WHERE group_id = ? ORDER BY id DESC LIMIT 50"
    )
    .all(groupId) as Message[];
}

export function createMessage(input: { groupId: number; author: string; body: string }) {
  const db = getDb();
  const result = db
    .prepare("INSERT INTO messages (group_id, author, body) VALUES (?, ?, ?)")
    .run(input.groupId, input.author, input.body);
  return Number(result.lastInsertRowid);
}

export function getChatMessages(channel: string, limit = 300): ChatMessage[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, channel, author, body, created_at as createdAt FROM chat_messages WHERE channel = ? ORDER BY id ASC LIMIT ?"
    )
    .all(channel, limit) as ChatMessage[];
}

export function createChatMessage(input: { channel: string; author: string; body: string }) {
  const db = getDb();
  const result = db
    .prepare("INSERT INTO chat_messages (channel, author, body) VALUES (?, ?, ?)")
    .run(input.channel, input.author, input.body);
  return Number(result.lastInsertRowid);
}

export function createGroup(input: {
  name: string;
  city: string;
  description: string;
  agentFlavor?: string;
}) {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO groups (name, city, description, members, next_event, agent_flavor) VALUES (?, ?, ?, 1, ?, ?)"
    )
    .run(input.name, input.city, input.description, "No event scheduled yet", input.agentFlavor ?? null);

  return Number(result.lastInsertRowid);
}

export function createEvent(input: {
  groupId: number;
  title: string;
  dateLabel: string;
  location: string;
  description: string;
  kind: string;
}) {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO events (group_id, title, date_label, location, description, kind) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(input.groupId, input.title, input.dateLabel, input.location, input.description, input.kind);

  db.prepare("UPDATE groups SET next_event = ? WHERE id = ?").run(`${input.title} · ${input.dateLabel}`, input.groupId);
  return Number(result.lastInsertRowid);
}
