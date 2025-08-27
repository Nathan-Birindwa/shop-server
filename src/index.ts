import express from "express";
import dotenv from "dotenv";
import db from "./config/database";
import authRouter from "./routes/auth.routes";
import prisma from "./utils/prisma";

dotenv.config();
const server = express();
const port = process.env.PORT;

// Checking database connection
db.connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

server.use(express.json());

server.use("/api", authRouter);

server.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

// Running server on desire port
server.listen(port, () => {
  console.log(`Running on http://localhost:${port}/`);
});
