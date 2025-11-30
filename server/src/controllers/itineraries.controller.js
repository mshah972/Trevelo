import { generateTripPlanOrError } from "../services/openai.service.js";
import { createJob, getJob, setJobRunning, setJobCompleted, setJobFailed } from "../services/jobs.service.js";

/**
 * POST /api/itineraries/start
 * Create a job and immediately starts processing
 */
export async function startItinerary(req, res, next){
    try {
        const { prompt } = req.body || {};

        // 1. Validate Input
        if (!prompt?.trim()) {
            const err = new Error("Missing 'prompt'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        // 2. Get User ID (from Auth Middleware)
        // If req.user is undefined, fallback to 'anonymous' (or throw error if strict)
        const userId = req.user ? req.user.sub : 'anonymous';

        // 3. Create Job (Pass userId now)
        const jobId = await createJob(prompt.trim(), userId);

        // 4. Start Background Process (Fire & Forget)
        processJob(jobId).catch((err) => {
            console.error(`[Background] Job ${jobId} failed to process:`, err);
        });

        // 5. Return Job ID immediately
        res.status(202).json({ ok: true, jobId });
    } catch (err) {
        next(err);
    }
}

async function processJob(jobId){
    try {
        // Mark as running
        await setJobRunning(jobId);

        // Fetch fresh job data
        const job = await getJob(jobId);

        // Call OpenAI
        const data = await generateTripPlanOrError(job.prompt);

        // Save Result
        await setJobCompleted(jobId, data);
    } catch (error) {
        console.error(`[processJob] Error processing ${jobId}:`, error);
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