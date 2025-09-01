import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import prisma from "./utils/prisma";

dotenv.config();

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

server.use("/api", authRouter);

server.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}/`);
});
