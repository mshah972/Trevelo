import crypto from "node:crypto";
import { db, TableName } from "./dynamo.service.js";

export async function createTrip(userId, payload) {
    const tripId = crypto.randomUUID();
    const now = Date.now();
    const item = {
        PK: `USER#${userId}`,
        SK: `TRIP#${tripId}`,
        tripId,
        userId,
        title: payload.title || null,
        prompt: payload.prompt || null,
        itinerary: payload.itinerary || null,
        createdAt: now,
        updatedAt: now,
    };
    await db.put(item);
    return item;
}

export async function listTrips(userId) {
    const resp = await db.query({
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: { ":pk": `USER#${userId}`, ":sk": "TRIP#"},
    });
    return resp.Items || [];
}

export async function getTrip(userId, tripId) {
    const { Item } = await db.get({ PK: `USER#${userId}`, SK: `TRIP#${tripId}` });
    return Item || null;
}

export async function updateTrip(userId, tripId, patch) {
    const now = Date.now();
    const expr = [];
    const names = {};
    const values = { ":updatedAt": now };

    for (const [k, v] of Object.entries(patch)) {
        const nk = `#${k}`;
        const vk = `#${k}`;
        names[nk] = k;
        values[vk] = v;
        expr.push(`${nk} = ${vk}`);
    }

    const UpdateExpression = `SET ${expr.join(", ")}, updatedAt = :updatedAt`;

    const resp = await db.update({
        Key: { PK: `USER#${userId}`, SK: `TRIP#${tripId}`},
        TableName,
        UpdateExpression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
    });
    return resp.Attributes;
}

export async function deleteTrip(userId, tripId) {
    await db.delete({ PK: `USER#${userId}`, SK: `TRIP#${tripId}` });
}