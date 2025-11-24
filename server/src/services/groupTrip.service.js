import crypto from "node:crypto";
import { db } from "./dynamo.service.js";

export async function createGroupTrip(groupId, userId, payload) {
    const tripId = crypto.randomUUID();
    const now = Date.now();
    const item = {
        PK: `GROUP#${groupId}`,
        SK: `GTRIP#${tripId}`,
        groupId,
        tripId,
        createdBy: userId,
        prompt: payload.prompt,
        itinerary: payload.itinerary || null,
        createdAt: now,
    };
    await db.put(item);
    return item;
}

export async function listGroupTrips(groupId) {
    const resp = await db.query({
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: { ":pk": `GROUP#${groupId}`, ":sk": "GTRIP#" },
    });
    return resp.Items|| [];
}