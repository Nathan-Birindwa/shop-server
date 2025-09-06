import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import db from "./config/database";
import cors from "cors";
dotenv.config();

// Database connection checking

db.connect()
  .then(() => console.log("Database connection was established ✅"))
  .catch((err) =>
    console.log("Database connection failed to establish ❌ due to", err)
  );

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

server.use("/api", authRouter);

server.get("/", async (req, res) => {
  const response = await db.query("SELECT * FROM users");
  console.log(response.rows);
  res.send("Hello World");
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}/`);
});
