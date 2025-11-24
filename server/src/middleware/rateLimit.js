// src/middleware/rateLimit.js
import rateLimit from "express-rate-limit";

export const generateLimiter = rateLimit({
    windowMs: 60_000,  // 1 minute
    max: 20,           // 20 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
});
