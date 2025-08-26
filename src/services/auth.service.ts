import db from "../config/database";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
};

export const createUser = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
