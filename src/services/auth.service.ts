import bcrypt from "bcrypt";
import db from "../config/database";

const saltRounds = 16;

interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
  // Don't include password in return type for security
}

interface UserCreationResult {
  success: boolean;
  user?: User;
  error?: string;
}

export default async function userCreation(
  fullName: string,
  email: string,
  password: string
): Promise<UserCreationResult> {
  try {
    // Input validation
    if (!fullName?.trim() || !email?.trim() || !password) {
      throw new Error("All fields are required");
    }

    // ✅ Use PostgreSQL syntax consistently
    const result = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    // ✅ Correct way to access PostgreSQL results
    if (result.rows.length > 0) {
      throw new Error("There is an account associated with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Create new user with RETURNING clause
    const new_user = await db.query(
      `INSERT INTO users (fullName, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, fullName, email`,
      [fullName, email, hashedPassword]
    );

    // ✅ Return structured result
    return {
      success: true,
      user: new_user.rows[0],
    };
  } catch (error: any) {
    console.error("User creation error:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}
