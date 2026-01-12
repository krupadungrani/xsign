// API Route: List user signatures
import { getDatabase, jsonResponse } from "../api/_utils";
import { digitalSignatures } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return jsonResponse({ error: "userId is required" }, 400);
    }

    const db = getDatabase();

    const signatures = await db
      .select()
      .from(digitalSignatures)
      .where(eq(digitalSignatures.userId, userId));

    return jsonResponse({
      success: true,
      signatures: signatures.map((sig) => ({
        id: sig.id,
        name: sig.name,
        fullName: sig.fullName,
        companyName: sig.companyName,
        location: sig.location,
        timeZone: sig.timeZone,
        signatureImage: sig.signatureImage,
        createdAt: sig.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("List signatures error:", error);
    return jsonResponse({ error: error.message || "Failed to list signatures" }, 500);
  }
}

