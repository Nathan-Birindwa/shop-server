import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id: Number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1hr",
  });
};
