import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import {upsertProfile} from "../controllers/users.controller.js";

const router = Router();

router.put("/users/me", authGuard, upsertProfile);

export default router;