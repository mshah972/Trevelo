import { isMember, getGroup } from "../services/group.service.js";

export async function groupMemberOnly(req, res, next) {
    try {
        const { sub } = req.user;
        const { groupId } = req.params;

        const group = await getGroup(groupId);
        if (!group) return res.status(404).json({ ok: false, error: "Group not found" });

        const member = await isMember(groupId, sub);
        if (!member) return res.status(403).json({ ok: false, error: "Forbidden: not a group member" });

        next();
    } catch (err) {
        next(err);
    }
}