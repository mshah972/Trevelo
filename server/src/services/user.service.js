import { db, TableName } from "./dynamo.service.js";

export async function getUserByID(userId) {
    const { Item } = await db.get({ PK: `USER#${userId}`, SK: "PROFILE" });
    return Item || null;
}

export async function upsertUserProfile(userId, profile) {
    const item = {
        PK: `USER#${userId}`,
        SK: "PROFILE",
        userId,
        ...profile,
        updatedAt: Date.now(),
    };

    await db.put(item);
    return item;
}