import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import {getMe} from "../controllers/auth.controller.js";

const router = Router();

// GET /api/auth/me - return current user claims + profile if exists
router.get("/auth/me", authGuard, getMe);

export default router;