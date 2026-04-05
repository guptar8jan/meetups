import { CHAT_CHANNELS, createChatMessage, getChatMessages } from "@/lib/store";
import { NextResponse } from "next/server";

function isChannel(value: string): value is (typeof CHAT_CHANNELS)[number] {
  return (CHAT_CHANNELS as readonly string[]).includes(value);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channel = url.searchParams.get("channel") ?? "";
  if (!isChannel(channel)) {
    return NextResponse.json({ ok: false, error: "invalid channel" }, { status: 400 });
  }
  const messages = getChatMessages(channel);
  return NextResponse.json({ ok: true, channel, messages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const channel = String(body?.channel ?? "").trim();
    const author = String(body?.author ?? "").trim().slice(0, 40);
    const text = String(body?.body ?? "").trim().slice(0, 2000);

    if (!isChannel(channel)) {
      return NextResponse.json({ ok: false, error: "invalid channel" }, { status: 400 });
    }
    if (!author) {
      return NextResponse.json({ ok: false, error: "author is required" }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ ok: false, error: "message body is required" }, { status: 400 });
    }

    const id = createChatMessage({ channel, author, body: text });
    return NextResponse.json({ ok: true, id, channel }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
