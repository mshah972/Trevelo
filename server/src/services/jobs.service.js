import crypto from "node:crypto";
import { db, TableName } from "./dynamo.service.js";

export const JobStatus = {
    queued: "queued",
    running: "running",
    completed: "completed",
    failed: "failed",
};

export async function createJob(prompt) {
    const jobId = crypto.randomUUID();
    const now = Date.now();
    const item = {
        id: jobId,
        PK: `JOB#${jobId}`,
        SK: "META",
        jobId,
        status: JobStatus.queued,
        prompt,
        createAt: now,
    };
    await db.put(item);
    return jobId;
}

export async function getJob(jobId) {
    const { Item } = await db.get({ id: jobId });
    return Item || null;
}

export async function setJobRunning(jobId) {
    const now = Date.now();
    await db.update({
        Key: { id: jobId },
        UpdateExpression: "SET #s = :s, startedAt = :t",
        ExpressionAttributeNames: { "#s" : "status" },
        ExpressionAttributeValues: { ":s": JobStatus.running, ":t" : now },
        TableName,
    });
}

export async function setJobCompleted(jobId, data) {
    const now = Date.now();
    await db.update({
        Key: { id: jobId },
        UpdateExpression: "SET #s = :s, completedAt = :t, #d = :d",
        ExpressionAttributeNames: { "#s" : "status", "#d" : "data" },
        ExpressionAttributeValues: { ":s": JobStatus.completed, ":t": now, ":d" : data },
        TableName,
    });
}

export async function setJobFailed(jobId, error) {
    const now = Date.now();
    await db.update({
        Key: { id: jobId },
        UpdateExpression: "SET #s = :s, completedAt = :t, #e = :e",
        ExpressionAttributeNames: { "#s": "status", "#e" : "error" },
        ExpressionAttributeValues: { ":s": JobStatus.failed, ":t": now, ":e": error },
        TableName,
    });
}