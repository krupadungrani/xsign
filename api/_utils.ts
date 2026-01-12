// Shared utility functions for Vercel API routes
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "../shared/schema";

// Configure Neon for HTTP mode (works on Vercel serverless)
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

export function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1, // Single connection for serverless
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
  });

  return drizzle({ client: pool, schema });
}

// Helper function to create response
export function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Helper to get request body
export async function getBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

// Helper to get query params
export function getQueryParams(url: URL) {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

