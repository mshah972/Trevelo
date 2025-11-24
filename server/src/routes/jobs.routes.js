import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { getJobById } from "../controllers/jobs.controller.js";

const router = Router();

// GET /api/job/:id - requires auth
router.get("/job/:id", authGuard, getJobById);

export default router;