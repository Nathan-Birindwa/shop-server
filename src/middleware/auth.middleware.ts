import { Response, Request } from "express";
import userCreation from "../services/auth.service";

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

    // ✅ Await the async function
    const results = await userCreation(fullName, email, password);

    console.log("User creation results:", results);

    // ✅ Handle success/failure from service
    if (results.success) {
      res.status(201).json({
        message: "Account created successfully",
        data: {
          id: results.user?.id,
          fullName: results.user?.fullName,
          email: results.user?.email,
          // Don't return password or sensitive data
        },
      });
    } else {
      // Handle specific error cases
      const statusCode = results.error?.includes("already exists") ? 409 : 400;
      res.status(statusCode).json({
        message: "Failed to create account",
        error: results.error,
      });
    }
  } catch (err: any) {
    console.error("Controller error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: "Something went wrong on our end",
    });
  }
}
