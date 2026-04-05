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
  if (normalized.includes("coffee") && normalized.includes("frontend")) return "Latte & Components";
  if (normalized.includes("backend")) return "Packet & Pints";
  if (normalized.includes("ai")) return "Model Mischief Club";
  if (normalized.includes("design")) return "Pixels & People";
  return `${titleCase(prompt.split(" ").slice(0, 3).join(" "))} Society`;
}

function generateEventName(prompt: string, flavor: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("coffee") && normalized.includes("frontend")) return "Coffee & Components Night";
  if (normalized.includes("hackathon")) return "Build Sprint Night";
  if (normalized.includes("demo")) return "Demo Jam";
  if (normalized.includes("happy hour")) return "Builders After Hours";
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
