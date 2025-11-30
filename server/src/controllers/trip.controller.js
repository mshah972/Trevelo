import { generateTripPlanOrError } from "../services/openai.service.js";
import { createTrip, listTrips, updateTrip, deleteTrip, getTrip } from "../services/trip.service.js";
// import {create} from "axios";

export async function createTripFromPrompt(req, res, next){
    try {
        const { sub } = req.user;
        const { prompt } = req.body || {};

        if(!prompt?.trim()) {
            const err = new Error("Missing 'prompt'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        const data = await generateTripPlanOrError(prompt.trim());
        const saved = await createTrip(sub, { prompt: prompt.trim(), itinerary: data, title: data.tripTitle || null });
        res.status(201).json({ ok: true, trip: saved });
    } catch (err) {
        next(err);
    }
}

export async function listMyTrips(req, res, next) {
    try {
        const { sub } = req.user;
        const trips = await listTrips(sub);
        res.json({ ok: true, trips });
    } catch (err) {
        next(err);
    }
}

export async function getMyTrip(req, res, next) {
    try {
        const { sub } = req.user;
        const { tripId } = req.params;
        const trip = await getTrip(sub, tripId);
        if (!trip) return res.status(404).json({ ok: false, error: "Trip not found" });
        res.json({ ok: true, trip });
    } catch (err) {
        next(err);
    }
}

export async function updateMyTrip(req, res, next) {
    try {
        const { sub } = req.user;
        const { tripId } = req.params;
        const { title } = req.body || {};
        const updated = await updateTrip(sub, tripId, { title });
        res.json({ ok: true, trip: updated });
    } catch (err) {
        next(err);
    }
}

export async function deleteMyTrip(req, res, next) {
    try{
        const { sub } = req.user;
        const { tripId } = req.params;
        await deleteTrip(sub, tripId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}