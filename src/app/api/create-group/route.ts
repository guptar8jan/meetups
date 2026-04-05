import { createGroup } from "@/lib/store";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "").trim();
    const city = String(form.get("city") || "").trim();

    if (!prompt || !city) {
      return NextResponse.json({ ok: false, error: "Missing prompt or city" }, { status: 400 });
    }

    const groupId = createGroup({
      name: prompt,
      city,
      description: `Created from API route: ${prompt}`,
    });

    return NextResponse.json({ ok: true, groupId, prompt, city });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
