import bcrypt from "bcrypt";
import db from "../config/database";
import jwt from "jsonwebtoken";

const saltRounds = 10;

interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
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

    // Ensure email is unique
    const result = await db.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (result.rows.length > 0) {
      throw new Error("There is an account associated with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const new_user = await db.query(
      `INSERT INTO users (fullName, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, fullName, email, createdAt`,
      [fullName, email.toLowerCase(), hashedPassword]
    );

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

// -------------------------
// SIGNIN FUNCTION
// -------------------------
export async function userSignin(email: string, password: string) {
  try {
    // Find user by email
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email.toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Return success response with token and user info
    return {
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        createdAt: user.createdat,
      },
    };
  } catch (err: any) {
    console.error("Signin error:", err);
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}
