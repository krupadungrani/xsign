// API Route: Get document details
import { getDatabase, jsonResponse } from "../api/_utils";
import { pdfDocuments, appliedSignatures, digitalSignatures } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");

    if (!documentId) {
      return jsonResponse({ error: "documentId is required" }, 400);
    }

    const db = getDatabase();

    // Get document
    const [document] = await db
      .select()
      .from(pdfDocuments)
      .where(eq(pdfDocuments.id, documentId))
      .limit(1);

    if (!document) {
      return jsonResponse({ error: "Document not found" }, 404);
    }

    // Get applied signatures
    const signatures = await db
      .select()
      .from(appliedSignatures)
      .where(eq(appliedSignatures.documentId, documentId));

    // Get signature details for each applied signature
    const appliedSignaturesWithDetails = await Promise.all(
      signatures.map(async (sig) => {
        const [signature] = await db
          .select()
          .from(digitalSignatures)
          .where(eq(digitalSignatures.id, sig.signatureId))
          .limit(1);

        return {
          id: sig.id,
          pageNumber: sig.pageNumber,
          position: sig.position,
          appliedAt: sig.appliedAt,
          signature: signature
            ? {
                id: signature.id,
                name: signature.name,
                fullName: signature.fullName,
                companyName: signature.companyName,
                signatureImage: signature.signatureImage,
              }
            : null,
        };
      })
    );

    return jsonResponse({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        originalName: document.originalName,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        status: document.status,
        uploadedAt: document.uploadedAt,
      },
      appliedSignatures: appliedSignaturesWithDetails,
    });
  } catch (error: any) {
    console.error("Get document error:", error);
    return jsonResponse({ error: error.message || "Failed to get document" }, 500);
  }
}

