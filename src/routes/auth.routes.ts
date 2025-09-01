import { Router } from "express";
import create_Account from "../middleware/auth.middleware";
const router = Router();

router.post("/signup", create_Account as any);

export default router;
