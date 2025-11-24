import { upsertUserProfile } from "../services/user.service.js";

export async function upsertProfile(req, res, next) {
    try {
        const { sub } = req.user;
        const { displayName } = req.body || {};

        if (!displayName?.trim()) {
            const err = new Error("Missing 'displayName'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        const saved = await upsertUserProfile(sub, { displayName: displayName.trim() });
        res.json({ ok: true, profile: saved });
    } catch (err) {
        next(err);
    }
}