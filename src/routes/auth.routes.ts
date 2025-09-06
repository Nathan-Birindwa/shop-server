import { Router } from "express";
import create_Account from "../middleware/auth.middleware";
const router = Router();
import { sign_in_account } from "../middleware/auth.middleware";

router.post("/signup", create_Account as any);
router.post("/signin", sign_in_account as any);

export default router;
