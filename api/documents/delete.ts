// API Route: Delete document
import { getDatabase, jsonResponse } from "../api/_utils";
import { pdfDocuments, appliedSignatures } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");
    const userId = url.searchParams.get("userId");

    if (!documentId || !userId) {
      return jsonResponse({ error: "documentId and userId are required" }, 400);
    }

    const db = getDatabase();

    // Verify document exists and belongs to user
    const [document] = await db
      .select()
      .from(pdfDocuments)
      .where(eq(pdfDocuments.id, documentId))
      .limit(1);

    if (!document) {
      return jsonResponse({ error: "Document not found" }, 404);
    }

    if (document.userId !== userId) {
      return jsonResponse({ error: "Unauthorized" }, 403);
    }

    // Delete applied signatures first
    await db
      .delete(appliedSignatures)
      .where(eq(appliedSignatures.documentId, documentId));

    // Delete document
    await db
      .delete(pdfDocuments)
      .where(eq(pdfDocuments.id, documentId));

    return jsonResponse({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete document error:", error);
    return jsonResponse({ error: error.message || "Failed to delete document" }, 500);
  }
}

