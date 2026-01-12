// API Route: Upload PDF document (using Vercel Blob)
import { getDatabase, jsonResponse } from "../api/_utils";
import { pdfDocuments } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const userId = formData.get("userId") as string;

    if (!file) {
      return jsonResponse({ error: "No PDF file uploaded" }, 400);
    }

    if (!userId) {
      return jsonResponse({ error: "userId is required" }, 400);
    }

    if (file.type !== "application/pdf") {
      return jsonResponse({ error: "Only PDF files are allowed" }, 400);
    }

    const db = getDatabase();

    // For Vercel Blob, you would use:
    // import { put } from '@vercel/blob';
    // const blob = await put(file.name, file, { access: 'public' });
    
    // For now, we'll store metadata and process the file
    const fileName = `pdfs-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
    
    const [document] = await db
      .insert(pdfDocuments)
      .values({
        userId,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        filePath: fileName, // Store blob URL or filename
        pageCount: 0,
        pageSizes: "[]",
        status: "pending",
      })
      .returning();

    return jsonResponse({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        originalName: document.originalName,
        fileSize: document.fileSize,
        status: document.status,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return jsonResponse({ error: error.message || "Upload failed" }, 500);
  }
}

