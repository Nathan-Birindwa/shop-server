import { Response, Request } from "express";
import userCreation, { userSignin } from "../services/auth.service";

// --------------------
// SIGN UP CONTROLLER
// --------------------
export default async function create_Account(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body;

    // ✅ Input validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "fullName, email, and password are required",
      });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        error: "Please provide a valid email address",
      });
    }

    // ✅ Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password too weak",
        error: "Password must be at least 8 characters long",
      });
    }

    // ✅ Call service
    const results = await userCreation(fullName, email, password);

    if (results.success) {
      return res.status(201).json({
        message: "Account created successfully",
        data: {
          id: results.user?.id,
          fullName: results.user?.fullName,
          email: results.user?.email,
        },
      });
    } else {
      const statusCode = results.error?.includes("email") ? 409 : 400;
      return res.status(statusCode).json({
        message: "Failed to create account",
        error: results.error,
      });
    }
  } catch (err: any) {
    console.error("Controller error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: "Something went wrong on our end",
    });
  }
}

// --------------------
// SIGN IN CONTROLLER
// --------------------
export async function sign_in_account(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        error: "Email and password are required",
      });
    }

    const result = await userSignin(email, password);

    if (result.success) {
      return res.status(200).json({
        message: "Signin successful",
        token: result.token,
        user: result.user,
      });
    } else {
      return res.status(401).json({
        message: "Signin failed",
        error: result.error,
      });
    }
  } catch (err: any) {
    console.error("Signin controller error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: "Something went wrong on our end",
    });
  }
}
