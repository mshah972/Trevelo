import { generateTripPlanOrError } from "../services/openai.service.js";
import { createGroupTrip, listGroupTrips } from "../services/groupTrip.service.js";

export async function listTripsInGroup(req, res, next) {
    try {
        const { groupId } = req.params;
        const { trips } = listGroupTrips(groupId);
        res.json({ ok: true, trips });
    } catch (err) {
        next(err);
    }
}

export async function createTripInGroup(req, res, next) {
    try {
        const { sub } = req.user;
        const { groupId } = req.params;
        const { prompt } = req.body || {};
        if (!prompt?.trim()) {
            const err = new Error("Missing 'prompt'.");
            err.code = "BAD_REQUEST";
            throw err;
        }
        const data = await generateTripPlanOrError(prompt.trim());
        const saved = await createGroupTrip(groupId, sub, { prompt: prompt.trim(), itinerary: data });
        res.status(201).json({ ok: true, trip: saved });
    } catch (err) {
        next(err);
    }
}