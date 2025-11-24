import { db } from "./dynamo.service.js";

export async function castVote(groupId, tripId, userId, value = 1) {
    const item = {
        PK: `GROUP#${groupId}`,
        SK: `VOTE#${tripId}#${userId}`,
        groupId,
        tripId,
        userId,
        value,
        createdAt: Date.now(),
    };
    await db.put(item);
    return item;
}

export async function tallyVotes(groupId, tripId) {
    const resp = await db.query({
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: { ":pk": `GROUP#${groupId}`, ":sk": `VOTE#${tripId}` },
    });
    const items = resp.Items || [];
    const total = items.reduce((sum, v) => sum + (v.value || 0), 0);
    return { count: items.length, total, votes: items };
}