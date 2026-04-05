import { createGroup, findGroupByName } from "@/lib/store";
import { NextResponse } from "next/server";

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateGroupNameVariants(prompt: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("coffee") && normalized.includes("frontend")) {
    return [
      "Latte & Components",
      "Espresso & Elements",
      "Beans & Breakpoints",
      "Caffeine & Components",
    ];
  }
  if (normalized.includes("backend")) {
    return ["Packet & Pints", "Ports & Pours", "Queues & Cocktails"];
  }
  if (normalized.includes("ai") && normalized.includes("demo")) {
    return ["Model Mischief Club", "Demo Drift Lab", "Neural Showcase Society"];
  }
  if (normalized.includes("ai")) {
    return ["Neural Nights", "Weights & Wonder", "Prompt People Club"];
  }
  if (normalized.includes("design")) {
    return ["Pixels & People", "Frames & Friends", "Design After Dark"];
  }
  const base = `${titleCase(prompt.split(" ").slice(0, 3).join(" "))} Society`;
  return [base, `${base} Collective`, `${base} Guild`];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();
    const city = String(body?.city || "").trim();
    const flavor = String(body?.flavor || "").trim();

    if (!prompt || !city) {
      return NextResponse.json({ ok: false, error: "prompt and city are required" }, { status: 400 });
    }

    const candidates = generateGroupNameVariants(prompt);
    let chosen = candidates.find((candidate) => !findGroupByName(candidate));
    if (!chosen) {
      const fallbackBase = candidates[0];
      let i = 2;
      while (!chosen) {
        const variant = `${fallbackBase} ${i}`;
        if (!findGroupByName(variant)) chosen = variant;
        i += 1;
      }
    }

    const groupId = createGroup({
      name: chosen,
      city,
      description: `Created from prompt: ${prompt}`,
      agentFlavor: flavor || undefined,
    });

    return NextResponse.json({ ok: true, groupId, name: chosen, city, flavor, existing: false }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
