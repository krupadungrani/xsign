// API Route: Create signature
import { getDatabase, jsonResponse } from "../api/_utils";
import { digitalSignatures, users } from "../shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { CertificateService } from "../server/services/certificate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, name, fullName, companyName, location, timeZone, signatureImage, password } = body;

    if (!userId || !email || !name || !fullName || !location || !timeZone) {
      return jsonResponse(
        { error: "Missing required fields: userId, email, name, fullName, location, timeZone" },
        400
      );
    }

    const db = getDatabase();

    // Verify user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    // Generate certificate and keys
    const certificateService = new CertificateService();
    const { certificate, privateKey } = certificateService.generateKeyPairAndCertificate({
      fullName,
      companyName,
      location,
      email,
    });

    // Encrypt private key
    const keyPassword = crypto.randomBytes(32).toString('hex');
    const encryptedPrivateKey = certificateService.encryptPrivateKey(privateKey, keyPassword);

    // Create signature
    const [signature] = await db
      .insert(digitalSignatures)
      .values({
        userId,
        name,
        fullName,
        companyName: companyName || "",
        location,
        timeZone,
        certificate,
        privateKey: `${encryptedPrivateKey}:${keyPassword}`,
        signatureImage: signatureImage || null,
        password: password || null,
      })
      .returning();

    return jsonResponse({
      success: true,
      signature: {
        id: signature.id,
        name: signature.name,
        fullName: signature.fullName,
        companyName: signature.companyName,
        location: signature.location,
        createdAt: signature.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Signature creation error:", error);
    return jsonResponse({ error: error.message || "Failed to create signature" }, 500);
  }
}

