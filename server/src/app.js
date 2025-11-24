import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import itinerariesRoutes from "./routes/itineraries.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import tripsRoutes from "./routes/trips.routes.js";
import groupsRoutes from "./routes/groups.routes.js";

export function createApp() {
    const app = express();

    // CORS
    app.use(cors({
        origin: [config.frontendOrigin],
        credentials: true,
    }));

    // Security + parsing
    app.use(helmet());
    app.use(express.json({ limit: "1mb" }));
    app.use(morgan("dev"));

    // Routes
    console.log("Mounting routes: health, itineraries, jobs, auth, users, trips, groups");
    app.use("/api", healthRoutes);
    app.use("/api", itinerariesRoutes);
    app.use("/api", jobsRoutes);
    app.use("/api", authRoutes);
    app.use("/api", usersRoutes);
    app.use("/api", tripsRoutes);
    app.use("/api", groupsRoutes);

    // Error handler
    app.use(errorHandler);

    return app;
}