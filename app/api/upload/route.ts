import { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return Response.json(
      { ok: false, message: "File is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/kb/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
