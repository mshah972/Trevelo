import { generateTripPlanOrError } from "../services/openai.service.js";
import { createJob, getJob, setJobRunning, setJobCompleted, setJobFailed } from "../services/jobs.service.js";

/**
 * POST /api/itineraries/start
 * Create a job and immediately starts processing
 */
export async function startItinerary(req, res, next){
    try {
        const { prompt } = req.body || {};
        if (!prompt?.trim()) {
            const err = new Error("Missing 'prompt'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        const jobId = await createJob(prompt.trim());
        processJob(jobId).catch(() => {/* logged in processJob */});

        res.status(202).json({ ok: true, jobId });
    } catch (err) {
        next(err);
    }
}

async function processJob(jobId){
    try {
        await setJobRunning(jobId);
        const job = await getJob(jobId);
        const data = await generateTripPlanOrError(job.prompt);
        await setJobCompleted(jobId, data);
    } catch (error) {
        await setJobFailed(jobId, {
            message: error?.message || String(error),
            ...(error?.code ? { code: error.code, details: error.details ?? null } : {}),
        })
    }
}

/**
 * POST /api/itineraries/generate
 * Synchronous generation (returns the itinerary directly). Protected route.
 */
export async function generateItinerary(req, res, next){
    try {
        const { prompt } = req.body || {};
        if (!prompt?.trim()) {
            const err = new Error("Missing 'Prompt'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        const data = await generateTripPlanOrError(prompt.trim());
        res.json({ ok: true, data: data });
    } catch (err) {
        next(err);
    }
}