import OpenAI from "openai";
import { z } from "zod";
import { config } from "../config/env.js";

const GPSCoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
}).strict();

const ActivitySchema = z.object({
    timeOfDay: z.enum(["Morning", "Afternoon", "Evening", "Night"]),
    location: z.string(),
    description: z.string(),
    costLabel: z.enum(["low", "mid", "high"]),
    gpsCoordinates: GPSCoordinatesSchema,
}).strict();

const RestaurantSchema = z.object({
    lunch: z.object({
        name: z.string(),
        description: z.string(),
    }).strict(),
    dinner: z.object({
        name: z.string(),
        description: z.string(),
    }).strict(),
    snacks: z.array(z.object({
        name: z.string(),
        description: z.string(),
    }).strict()).optional(),
    mustTry: z.array(z.object({
        name: z.string(),
        description: z.string(),
    }).strict()).optional(),
}).strict();

const DayPlanSchema = z.object({
    day: z.number().int(),
    theme: z.string(),
    activities: z.array(ActivitySchema),
    restaurants: RestaurantSchema,
}).strict();

const PlacesSchema = z.object({
    places: z.object({
        city: z.string().min(1),
        stateOrRegion: z.string(),
        country: z.string(),
    }).strict(),
}).strict();

const TripPlanOrErrorSchema = z.object({
    mode: z.enum(["trip", "error"]),
    error: z.string().min(1).nullable(),
    tripTitle: z.string().nullable(),
    startingMessage: z.string().nullable(),
    summary: z.string().nullable(),
    dailyPlan: z.array(DayPlanSchema).nullable(),
    listOfPlaces: z.array(PlacesSchema).min(1).nullable(),
    totalBudget: z.enum(["low", "mid", "high"]).nullable(),
}).strict().superRefine((val, ctx) => {
    // Enforce discriminator rules
    if (val.mode === "trip") {
        // error must be null; all trip fields must be non-null
        const problems = [];
        if (val.error !== null) problems.push("error must be null when mode='trip'");
        if (val.tripTitle == null) problems.push("tripTitle must be provided when mode='trip'");
        if (val.startingMessage == null) problems.push("startingMessage must be provided when mode='trip'");
        if (val.summary == null) problems.push("summary must be provided when mode='trip'");
        if (val.dailyPlan == null) problems.push("dailyPlan must be provided when mode='trip'");
        if (val.listOfPlaces == null) problems.push("listOfPlaces must be provided when mode='trip'");
        if (val.totalBudget == null) problems.push("totalBudget must be provided when mode='trip'");

        for (const p of problems) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: p, path: [] });
        }
    } else if (val.mode === "error") {
        // error must be a non-empty string; trip fields must be null
        const problems = [];
        if (val.error == null || val.error.trim().length === 0) {
            problems.push("error must be a non-empty string when mode='error'");
        }
        if (val.tripTitle !== null) problems.push("tripTitle must be null when mode='error'");
        if (val.startingMessage !== null) problems.push("startingMessage must be null when mode='error'");
        if (val.summary !== null) problems.push("summary must be null when mode='error'");
        if (val.dailyPlan !== null) problems.push("dailyPlan must be null when mode='error'");
        if (val.listOfPlaces !== null) problems.push("listOfPlaces must be null when mode='error'");
        if (val.totalBudget !== null) problems.push("totalBudget must be null when mode='error'");

        for (const p of problems) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: p, path: [] });
        }
    }
});

const tripPlanOrErrorJsonSchema = {
    type: "object",
    properties: {
        mode: {
            type: "string",
            enum: ["trip", "error"],
            description:
                "Discriminator. 'trip' for valid itineraries, 'error' for invalid/off-topic inputs.",
        },
        error: {
            type: ["string", "null"],
            minLength: 1,
            description:
                "Dynamic message when mode='error'. See rubric for greeting, missing info, or non-travel inputs.",
        },
        tripTitle: { type: ["string", "null"] },
        startingMessage: { type: ["string", "null"] },
        summary: { type: ["string", "null"] },
        dailyPlan: {
            type: ["array", "null"],
            items: {
                type: "object",
                properties: {
                    day: { type: "integer" },
                    theme: { type: "string" },
                    activities: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                timeOfDay: {
                                    type: "string",
                                    enum: ["Morning", "Afternoon", "Evening", "Night"],
                                },
                                location: { type: "string" },
                                description: { type: "string" },
                                costLabel: { type: "string", enum: ["low", "mid", "high"] },
                                gpsCoordinates: {
                                    type: "object",
                                    properties: {
                                        latitude: { type: "number" },
                                        longitude: { type: "number" },
                                    },
                                    required: ["latitude", "longitude"],
                                    additionalProperties: false,
                                },
                            },
                            required: [
                                "timeOfDay",
                                "location",
                                "description",
                                "costLabel",
                                "gpsCoordinates",
                            ],
                            additionalProperties: false,
                        },
                    },
                    restaurants: {
                        type: "object",
                        properties: {
                            lunch: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                },
                                required: ["name", "description"],
                                additionalProperties: false,
                            },
                            dinner: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                },
                                required: ["name", "description"],
                                additionalProperties: false,
                            },
                            snacks: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        description: { type: "string" },
                                    },
                                    required: ["name", "description"],
                                    additionalProperties: false,
                                },
                            },
                            mustTry: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        description: { type: "string" },
                                    },
                                    required: ["name", "description"],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ["lunch", "dinner", "snacks", "mustTry"],
                        additionalProperties: false,
                    },
                },
                required: ["day", "theme", "activities", "restaurants"],
                additionalProperties: false,
            },
        },
        listOfPlaces: {
            type: ["array", "null"],
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    places: {
                        type: "object",
                        properties: {
                            city: { type: "string", minLength: 1 },
                            stateOrRegion: { type: "string" },
                            country: { type: "string" },
                        },
                        required: ["city", "stateOrRegion", "country"],
                        additionalProperties: false,
                    },
                },
                required: ["places"],
                additionalProperties: false,
            },
        },
        totalBudget: {
            type: ["string", "null"],
            enum: ["low", "mid", "high", null],
        },
    },
    required: [
        "mode",
        "error",
        "tripTitle",
        "startingMessage",
        "summary",
        "dailyPlan",
        "listOfPlaces",
        "totalBudget",
    ],
    additionalProperties: false,
};

const client = new OpenAI({ apiKey: config.openaiApiKey });

/**
 * Generate a trip plan or an error message from a freeform user input.
 * Returns one of:
 *  - { mode: 'trip', ... full fields ... }
 *  - { mode: 'error', error: '...' }
 *
 * Throws typed errors:
 *  - BAD_REQUEST if input is invalid
 *  - ZOD_VALIDATION_ERROR with details[]
 *  - OPENAI_API_ERROR for upstream failures
 *  - UNEXPECTED_ERROR fallback
 */
export async function generateTripPlanOrError(userInput) {
    if (typeof userInput !== "string" || userInput.trim().length === 0) {
        const err = new Error("Prompt must be a non-empty string.");
        err.code = "BAD_REQUEST";
        throw err;
    }

    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: userInput.trim(),
                },
            ],
        },
    ];

    try {
        const response = await client.responses.parse({
            // Keep using your template prompt ID/version if required; otherwise omit
            prompt: {
                id: "pmpt_68dc81a73320819780475f732dcef55509b3ed914f0bf0af",
                version: "15",
            },
            input: messages,
            text: {
                format: {
                    type: "json_schema",
                    name: "trip_plan_or_error",
                    strict: true,
                    schema: tripPlanOrErrorJsonSchema,
                },
                verbosity: "medium",
            },
            reasoning: { summary: null },
        });

        const parsed = response.output_parsed;

        // Validate via Zod
        const validated = TripPlanOrErrorSchema.parse(parsed);

        // Return as-is; caller can branch on mode
        return validated;
    } catch (error) {
        if (error?.issues && Array.isArray(error.issues)) {
            const details = error.issues.map((e) => ({
                path: Array.isArray(e.path) ? e.path.join(".") : String(e.path ?? ""),
                message: e.message,
            }));
            const err = new Error(`Zod validation failed: ${JSON.stringify(details)}`);
            err.code = "ZOD_VALIDATION_ERROR";
            err.details = details;
            throw err;
        }
        if (error?.status || error?.code) {
            const err = new Error(
                `OpenAI error${error.status ? ` (${error.status})` : ""}: ${error.message || "Unknown error"}`
            );
            err.code = "OPENAI_API_ERROR";
            throw err;
        }
        const err = new Error(`Unexpected error: ${error?.message || String(error)}`);
        err.code = "UNEXPECTED_ERROR";
        throw err;
    }
}

/**
 * Helper: normalize friendly output for the frontend.
 * Useful if you want consistent shapes on the client side.
 */
export function normalizeTripPlanOutput(result) {
    if (result.mode === "error") {
        return {
            mode: "error",
            error: result.error,
        };
    }
    return {
        mode: "trip",
        tripTitle: result.tripTitle,
        startingMessage: result.startingMessage,
        summary: result.summary,
        dailyPlan: result.dailyPlan,
        listOfPlaces: result.listOfPlaces,
        totalBudget: result.totalBudget,
    };
}