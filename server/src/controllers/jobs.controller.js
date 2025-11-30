import { getJob } from "../services/jobs.service.js";

export async function getJobById(req, res, next) {
    try {
        const { id } = req.params;
        const job = await getJob(id);

        if (!job) return res.status(404).json({ ok: false, error: "Job not found" });
        res.json({ job });
    } catch (err) {
        next(err);
    }
}