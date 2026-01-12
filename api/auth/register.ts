// API Route: Register new user
import { getDatabase, jsonResponse } from "../api/_utils";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, companyName } = body;

    if (!email || !password || !fullName) {
      return jsonResponse(
        { error: "Email, password, and full name are required" },
        400
      );
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return jsonResponse({ error: "User already exists with this email" }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (auto-verified for simplicity)
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        fullName,
        companyName: companyName || null,
        isVerified: true, // Auto-verify for this deployment
        verificationToken: null,
      })
      .returning();

    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return jsonResponse({ error: error.message || "Registration failed" }, 500);
  }
}

