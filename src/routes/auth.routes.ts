import express from "express";
import { register, login } from "../controllers/auth.controller";
import { User } from "../models/user.model";

const router = express.Router();

router.post("/register", register as any);
router.post("/login", login as any);

export default router;
