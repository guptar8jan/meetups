import { createEvent, getGroups } from "@/lib/store";
import { NextResponse } from "next/server";

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateEventName(prompt: string, flavor: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("coffee") && normalized.includes("frontend")) return "Coffee & Components Night";
  if (normalized.includes("hackathon")) return "Build Sprint Night";
  if (normalized.includes("demo")) return "Demo Jam";
  if (normalized.includes("happy hour")) return "Builders After Hours";
  return `${titleCase(flavor || 'community')} Session`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();
    const dateLabel = String(body?.dateLabel || "").trim();
    const location = String(body?.location || "").trim();
    const flavor = String(body?.flavor || "").trim();
    const groupId = Number(body?.groupId);

    if (!prompt || !dateLabel || !location) {
      return NextResponse.json({ ok: false, error: "prompt, dateLabel, and location are required" }, { status: 400 });
    }

    const groups = getGroups();
    const targetGroup = Number.isFinite(groupId) ? groups.find((g) => g.id === groupId) : groups[0];
    if (!targetGroup) {
      return NextResponse.json({ ok: false, error: "No group available for this event" }, { status: 400 });
    }

    const title = generateEventName(prompt, flavor);
    const eventId = createEvent({
      groupId: targetGroup.id,
      title,
      dateLabel,
      location,
      description: `Created from prompt: ${prompt}`,
      kind: flavor || "meetup",
    });

    return NextResponse.json({ ok: true, eventId, title, groupId: targetGroup.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
