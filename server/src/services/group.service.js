import crypto from "node:crypto";
import { db } from "./dynamo.service.js";

export async function createGroup(userId, name) {
    const groupId = crypto.randomUUID();
    const inviteCode = crypto.randomBytes(4).toString("hex");
    const now = Date.now();
    await db.put({
        PK: `GROUP#${groupId}`,
        SK: "METADATA",
        groupId,
        name,
        createdBy: userId,
        inviteCode,
        createdAt: now,
    });

    await db.put({
        PK: `GROUP#${groupId}`,
        SK: `MEMBER#${userId}`,
        userId,
        role: "Owner",
        joinedAt: now,
    });
    return { groupId, inviteCode };
}

export async function getGroup(groupId) {
    const { Item } = await db.get({ PK: `GROUP#${groupId}`, SK: "METADATA" });
    return Item || null;
}

export async function listMembers(groupId) {
    const resp = await db.query({
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: { ":pk": `GROUP#${groupId}`, ":sk": "MEMBER#" },
    });
    return resp.Items || [];
}

export async function isMember(groupId, userId) {
    const { Item } = await db.get({ PK: `GROUP#${groupId}`, SK: `MEMBER#${userId}` });
    return !!Item;
}

export async function resolveInvite(inviteCode){
    const resp = await db.query({
        IndexName: "GSIInvite",
        KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
        ExpressionAttributeValues: { ":pk": `INVITE#${inviteCode}`, ":sk": "INVITE#" },
    });
    const item = resp.Items?.[0];
    if (!item) return null;
    return { groupId: item.groupId, name: item.name, createdBy: item.createdBy, inviteCode: item.inviteCode };
}

export async function addMember(groupId, userId, role = "member") {
    const now = Date.now();
    await db.put({
        PK: `GROUP#${groupId}`,
        SK: `MEMBER#${userId}`,
        userId,
        role,
        joinedAt: now,
    });
    return { groupId, userId, role, joinedAt: now };
}