import { Router } from "express";
import { generateLimiter } from "../middleware/rateLimit.js";
import { startItinerary, generateItinerary } from "../controllers/itineraries.controller.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();
console.log("Loaded itineraries.routes");

router.post("/itineraries/generate", generateLimiter, authGuard, generateItinerary);
router.post("/itineraries/start", authGuard, startItinerary);

export default router;
