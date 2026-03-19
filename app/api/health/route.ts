import { API_BASE_URL } from "@/lib/api-config";

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
