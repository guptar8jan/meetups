"use server";

import { createEvent, createGroup, getGroups } from "@/lib/store";
import { revalidatePath } from "next/cache";

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateGroupName(prompt: string, flavor: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("coffee") || normalized.includes("cafe")) return "Corner Cup & Chat";
  if (normalized.includes("potluck")) return "Table Together Circle";
  if (normalized.includes("park") || normalized.includes("picnic")) return "Green Space Gatherings";
  if (normalized.includes("volunteer") || normalized.includes("cleanup")) return "Hands & Hearts Circle";
  return `${titleCase(prompt.split(" ").slice(0, 3).join(" "))} Society`;
}

function generateEventName(prompt: string, flavor: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("potluck")) return "Community Potluck Night";
  if (normalized.includes("story") || normalized.includes("circle")) return "Story Circle Evening";
  if (normalized.includes("fair") || normalized.includes("market")) return "Neighborhood Fair Afternoon";
  if (normalized.includes("picnic") || normalized.includes("park")) return "Park Picnic Social";
  if (normalized.includes("coffee")) return "Coffee & Conversation Gathering";
  if (normalized.includes("happy hour") || normalized.includes("mixer")) return "Evening Mixer";
  return `${titleCase(flavor)} Session`;
}

export async function createGroupFromPromptAction(formData: FormData) {
  const prompt = String(formData.get("prompt") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const flavor = String(formData.get("flavor") || "").trim();
  if (!prompt || !city) return;

  const name = generateGroupName(prompt, flavor || "community host");
  const description = `Created from prompt: ${prompt}`;
  createGroup({ name, city, description, agentFlavor: flavor || null || undefined });
  revalidatePath("/");
  revalidatePath("/organizer");
}

export async function createEventFromPromptAction(formData: FormData) {
  const prompt = String(formData.get("prompt") || "").trim();
  const dateLabel = String(formData.get("dateLabel") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const flavor = String(formData.get("flavor") || "").trim();
  if (!prompt || !dateLabel || !location) return;

  const groups = getGroups();
  const targetGroup = groups[0];
  if (!targetGroup) return;

  const title = generateEventName(prompt, flavor || "community host");
  const description = `Created from prompt: ${prompt}`;
  createEvent({
    groupId: targetGroup.id,
    title,
    dateLabel,
    location,
    description,
    kind: flavor || "meetup",
  });
  revalidatePath("/");
  revalidatePath("/organizer");
}
