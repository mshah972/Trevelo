import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { generateLimiter } from "../middleware/rateLimit.js";
import { createTripFromPrompt, deleteMyTrip, updateMyTrip, listMyTrips, getMyTrip } from "../controllers/trip.controller.js";

const router = Router();

router.post("/trips", authGuard, generateLimiter, createTripFromPrompt);
router.get("/trips", authGuard, listMyTrips);
router.get("/trips/:tripId", authGuard, getMyTrip);
router.put("/trips/:tripId", authGuard, updateMyTrip);
router.delete("/trips/:tripId", authGuard, deleteMyTrip);

export default router;