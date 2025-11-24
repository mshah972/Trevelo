import { getUserByID } from "../services/user.service.js";

export async function getMe(req, res, next) {
    try {
        const { sub, email, name } = req.user;
        const profile = await getUserByID(sub);
        res.json({ ok: true, user: { sub, email, name, profile: profile || null } });
    } catch (err) {
        next(err);
    }
}