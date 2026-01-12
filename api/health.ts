// API Route: Health check
import { jsonResponse } from "../api/_utils";

export async function GET() {
  return jsonResponse({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

