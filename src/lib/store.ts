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
  `);

  const groupColumns = db.prepare("PRAGMA table_info(groups)").all() as { name: string }[];
  if (!groupColumns.some((column) => column.name === "description")) {
    db.exec("ALTER TABLE groups ADD COLUMN description TEXT NOT NULL DEFAULT ''");
  }
  if (!groupColumns.some((column) => column.name === "next_event")) {
    db.exec("ALTER TABLE groups ADD COLUMN next_event TEXT NOT NULL DEFAULT 'No event scheduled yet'");
  }
  if (!groupColumns.some((column) => column.name === "agent_flavor")) {
    db.exec("ALTER TABLE groups ADD COLUMN agent_flavor TEXT");
  }
  if (!groupColumns.some((column) => column.name === "created_at")) {
    db.exec("ALTER TABLE groups ADD COLUMN created_at TEXT");
  }

  const eventColumns = db.prepare("PRAGMA table_info(events)").all() as { name: string }[];
  if (eventColumns.length > 0) {
    if (!eventColumns.some((column) => column.name === "description")) {
      db.exec("ALTER TABLE events ADD COLUMN description TEXT NOT NULL DEFAULT ''");
    }
    if (!eventColumns.some((column) => column.name === "kind")) {
      db.exec("ALTER TABLE events ADD COLUMN kind TEXT NOT NULL DEFAULT 'meetup'");
    }
    if (!eventColumns.some((column) => column.name === "created_at")) {
      db.exec("ALTER TABLE events ADD COLUMN created_at TEXT");
    }
  }

  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Database) {
  const row = db.prepare("SELECT COUNT(*) as count FROM groups").get() as { count: number };
  if (row.count > 0) return;

  const insertGroup = db.prepare(
    "INSERT INTO groups (name, city, description, members, next_event, agent_flavor) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const frontend = insertGroup.run(
    "Frontend Builders",
    "Austin",
    "A meetup for frontend engineers who want practical talks, demos, and social hangs.",
    128,
    "Frontend happy hour · Apr 12 · 6:30 PM",
    "tech meetup planner"
  );

  const backend = insertGroup.run(
    "Backend Hangout",
    "Remote + NYC",
    "A community for backend engineers talking systems, APIs, and scaling in a relaxed setting.",
    84,
    "Backend & beer · Apr 13 · 7:00 PM",
    "after-work happy hour planner"
  );

  const insertEvent = db.prepare(
    "INSERT INTO events (group_id, title, date_label, location, description, kind) VALUES (?, ?, ?, ?, ?, ?)"
  );

  insertEvent.run(
    Number(frontend.lastInsertRowid),
    "Frontend happy hour",
    "Apr 12 · 6:30 PM",
    "Rooftop bar",
    "A casual meetup for frontend folks to talk UI systems, tools, and side projects.",
    "happy hour"
  );

  insertEvent.run(
    Number(backend.lastInsertRowid),
    "Backend & beer",
    "Apr 13 · 7:00 PM",
    "Downtown lounge",
    "An after-work social for backend engineers who like talking APIs, infra, and outages that taught them something.",
    "social"
  );
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
