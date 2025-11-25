import { createApp } from "./app.js";
import { config } from "./config/env.js";

const app = createApp();
const port = Number(config.port) || 4000;
let server;

function start() {
    server = app.listen(port, () => {
        console.log(`Trevelo API listening on :${port} (${config.nodeEnv})`);
    });
    server.on("error", (err) => {
        console.error("HTTP server error:", err);
        process.exit(1);
    });
}

function shutdown(signal) {
    console.log(`Received ${signal}, shutting down...`);
    if (server) {
        server.close(() => {
            console.log("HTTP server closed.");
            process.exit(0);
        });
        // Force-exit if not closed in time
        setTimeout(() => process.exit(0), 5000).unref();
    } else {
        process.exit(0);
    }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    shutdown("uncaughtException");
});

start();
