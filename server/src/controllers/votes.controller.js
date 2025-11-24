import { castVote, tallyVotes } from "../services/vote.service.js";

export async function voteForTrip(req, res, next) {
    try {
        const { sub } = req.user;
        const { groupId, tripId } = req.params;
        const { value = 1 } = req.body || {};
        const v = await castVote(groupId, tripId, sub, value);
        res.status(201).json({ ok: true, vote: v });
    } catch (err) {
        next(err);
    }
}

export async function getVoteTally(req, res, next) {
    try {
        const { groupId, tripId } = req.params;
        const tally = await tallyVotes(groupId, tripId);
        res.json({ ok: true, tally });
    } catch (err) {
        next(err);
    }
}