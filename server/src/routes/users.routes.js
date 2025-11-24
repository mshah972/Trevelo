import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

router.put("/users/me", authGuard, upsertProfile);

export default router;