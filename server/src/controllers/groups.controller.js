import { createGroup, getGroup, listMembers, resolveInvite, addMember, isMember } from "../services/group.service.js";

export async function createNewGroup(req, res, next) {
    try {
        const { sub } = req.user;
        const { name } = req.body || {};

        if (!name?.trim()) {
            const err = new Error("Missing 'name'.");
            err.code = "BAD_REQUEST";
            throw err;
        }
        const { groupId, inviteCode } = await createGroup(sub, name.trim());
        res.status(201).json({ ok: true, group: { groupId, name: name.trim(), inviteCode } });
    } catch (err) {
        next(err);
    }
}

export async function getGroupDetails(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await getGroup(groupId);
        if (!group) return res.status(404).json({ ok: false, error: "Group not found" });
        const members = await listMembers(groupId);
        res.json({ ok: true, group, members });
    } catch (err) {
        next(err);
    }
}

export async function joinGroup(req, res, next) {
    try {
        const { sub } = req.user;
        const { inviteCode } = req.body || {};
        if (!inviteCode?.trim()) {
            const err = new Error("Missing `inviteCode'.");
            err.code = "BAD_REQUEST";
            throw err;
        }

        const target = await resolveInvite(inviteCode.trim());
        if (!target) return res.status(404).json({ ok: false, error: "Invalid invite code" });

        const already = await isMember(target.groupId, sub, "member");
        if (already) return res.status(200).json({ ok: true, joined: true, groupId: target.groupId, });

        const member = await addMember(target.groupId, sub, "member");
        res.status(200).json({ ok: true, joined: true, groupId: target.groupId, member });
    } catch (err) {
        next(err);
    }
}