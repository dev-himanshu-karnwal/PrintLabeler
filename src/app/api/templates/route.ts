import { NextResponse } from "next/server";

let memoryTemplates: Array<{ id: string; name: string; updatedAt: string }> = [];

export async function GET() {
  return NextResponse.json({ templates: memoryTemplates });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { id: string; name: string };
  memoryTemplates = [{ id: body.id, name: body.name, updatedAt: new Date().toISOString() }, ...memoryTemplates];
  return NextResponse.json({ ok: true });
}
