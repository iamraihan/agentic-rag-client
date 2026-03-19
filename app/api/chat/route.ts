import { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";
import { chatRequestSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  return Response.json(data, { status: res.status });
}
