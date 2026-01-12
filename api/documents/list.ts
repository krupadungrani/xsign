// API Route: List user documents
import { getDatabase, jsonResponse } from "../api/_utils";
import { pdfDocuments } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return jsonResponse({ error: "userId is required" }, 400);
    }

    const db = getDatabase();

    const documents = await db
      .select()
      .from(pdfDocuments)
      .where(eq(pdfDocuments.userId, userId));

    return jsonResponse({
      success: true,
      documents: documents.map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        pageCount: doc.pageCount,
        status: doc.status,
        uploadedAt: doc.uploadedAt,
      })),
    });
  } catch (error: any) {
    console.error("List documents error:", error);
    return jsonResponse({ error: error.message || "Failed to list documents" }, 500);
  }
}

