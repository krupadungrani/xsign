// API Route: Apply signature to document
import { getDatabase, jsonResponse } from "../api/_utils";
import { appliedSignatures, pdfDocuments, digitalSignatures } from "../shared/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, signatureId, pageNumbers, position } = body;

    if (!documentId || !signatureId || !pageNumbers || !position) {
      return jsonResponse(
        { error: "Missing required fields: documentId, signatureId, pageNumbers, position" },
        400
      );
    }

    const db = getDatabase();

    // Verify document exists
    const [document] = await db
      .select()
      .from(pdfDocuments)
      .where(eq(pdfDocuments.id, documentId))
      .limit(1);

    if (!document) {
      return jsonResponse({ error: "Document not found" }, 404);
    }

    // Verify signature exists
    const [signature] = await db
      .select()
      .from(digitalSignatures)
      .where(eq(digitalSignatures.id, signatureId))
      .limit(1);

    if (!signature) {
      return jsonResponse({ error: "Signature not found" }, 404);
    }

    // Apply signature to each page
    const appliedSignaturesList = [];
    for (const pageNumber of pageNumbers) {
      // Check for existing signature on this page
      const [existing] = await db
        .select()
        .from(appliedSignatures)
        .where(
          and(
            eq(appliedSignatures.documentId, documentId),
            eq(appliedSignatures.pageNumber, pageNumber),
            eq(appliedSignatures.signatureId, signatureId)
          )
        )
        .limit(1);

      if (existing) {
        // Update existing
        await db
          .update(appliedSignatures)
          .set({ position })
          .where(eq(appliedSignatures.id, existing.id));
        appliedSignaturesList.push({ ...existing, position });
      } else {
        // Create new
        const [applied] = await db
          .insert(appliedSignatures)
          .values({
            documentId,
            signatureId,
            pageNumber,
            position,
          })
          .returning();
        appliedSignaturesList.push(applied);
      }
    }

    return jsonResponse({
      success: true,
      appliedSignatures: appliedSignaturesList,
    });
  } catch (error: any) {
    console.error("Apply signature error:", error);
    return jsonResponse({ error: error.message || "Failed to apply signature" }, 500);
  }
}

