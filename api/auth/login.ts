// API Route: Login user
import { getDatabase, jsonResponse } from "../api/_utils";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonResponse({ error: "Email and password are required" }, 400);
    }

    const db = getDatabase();

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    // Check if verified
    if (!user.isVerified) {
      return jsonResponse({ error: "Please verify your email before logging in" }, 401);
    }

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
    console.error("Login error:", error);
    return jsonResponse({ error: error.message || "Login failed" }, 500);
  }
}

